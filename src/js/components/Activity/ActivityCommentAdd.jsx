import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { AccountCircle, Send } from '@material-ui/icons';
import ActivityActions from '../../actions/ActivityActions';
import ActivityStore from '../../stores/ActivityStore';
import AppActions from '../../actions/AppActions';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


class ActivityCommentAdd extends Component {
  static propTypes = {
    activityTidbitWeVoteId: PropTypes.string.isRequired,
    activityCommentWeVoteId: PropTypes.string,
    addChildSavedFunction: PropTypes.func,
    classes: PropTypes.object,
    commentEditSavedFunction: PropTypes.func,
    hidePhotoFromTextField: PropTypes.bool,
    inEditMode: PropTypes.bool,
    parentCommentWeVoteId: PropTypes.string,  // Signifies that this is a response to a comment
  };

  constructor (props) {
    super(props);
    this.state = {
      activityCommentCount: 0,
      statementText: '',
    };
  }

  componentDidMount () {
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onActivityStoreChange();
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityCommentWeVoteId, activityTidbitWeVoteId } = this.props;
    if (activityCommentWeVoteId) {
      const activityComment = ActivityStore.getActivityCommentByWeVoteId(activityCommentWeVoteId);
      const {
        statement_text: statementText,
      } = activityComment;
      this.setState({
        statementText,
      });
      // console.log('ActivityCommentAdd onActivityStoreChange, activityCommentWeVoteId:', activityCommentWeVoteId, ', statementText:', statementText);
    }
    const activityCommentCount = ActivityStore.getActivityCommentParentCountByTidbitWeVoteId(activityTidbitWeVoteId);
    // console.log('activityTidbitWeVoteId activityCommentCount:', activityCommentCount);
    this.setState({
      activityCommentCount,
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const { full_name: voterFullName, voter_photo_url_tiny: voterPhotoUrlTiny } = voter;
    this.setState({
      voterFullName,
      voterPhotoUrlTiny,
    });
  }

  saveActivityComment = () => {
    const { activityCommentWeVoteId, activityTidbitWeVoteId, parentCommentWeVoteId } = this.props;
    const { visibilityIsPublic, statementText } = this.state;
    // console.log('ActivityPostModal activityTidbitWeVoteId:', activityTidbitWeVoteId, 'statementText: ', statementText, 'visibilityIsPublic: ', visibilityIsPublic);
    const visibilitySetting = visibilityIsPublic ? 'SHOW_PUBLIC' : 'FRIENDS_ONLY';
    ActivityActions.activityCommentSave(activityCommentWeVoteId, activityTidbitWeVoteId, statementText, visibilitySetting, parentCommentWeVoteId);
    this.setState({
      statementText: '',
    });
    if (this.props.addChildSavedFunction && parentCommentWeVoteId) {
      this.props.addChildSavedFunction(parentCommentWeVoteId);
    }
    if (this.props.commentEditSavedFunction) {
      this.props.commentEditSavedFunction();
    }
  }

  updateStatementTextToBeSaved = (e) => {
    this.setState({
      statementText: e.target.value,
    });
  }

  onClickShowActivityTidbitDrawer = () => {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('onClickShowActivityTidbitDrawer activityTidbitWeVoteId:', activityTidbitWeVoteId);
    AppActions.setActivityTidbitWeVoteIdForDrawer(activityTidbitWeVoteId);
    AppActions.setShowActivityTidbitDrawer(true);
  }

  render () {
    renderLog('ActivityCommentAdd');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityCommentWeVoteId, activityTidbitWeVoteId, classes, hidePhotoFromTextField, inEditMode } = this.props;
    const { statementText, activityCommentCount, voterFullName, voterPhotoUrlTiny } = this.state;
    if (!activityTidbitWeVoteId) {
      return null;
    }
    const showSendButton = inEditMode || statementText;
    // console.log('activityCommentCount:', activityCommentCount);
    return (
      <Wrapper commentsExist={(activityCommentCount > 0)}>
        <AddReplyTextWrapper>
          <FormControl classes={{ root: classes.formControl }}>
            {/* NOT WORKING in classes: , multiline: classes.textFieldMultilineClasses */}
            <TextField
              id={`activityCommentAdd-${activityTidbitWeVoteId}-${activityCommentWeVoteId}`}
              classes={{ root: classes.textFieldClasses }}
              label={inEditMode ? 'Edit your comment...' : 'Add your comment...'}
              margin="dense"
              multiline
              onChange={this.updateStatementTextToBeSaved}
              rowsMax={4}
              value={statementText}
              variant="outlined"
              InputProps={{
                classes: { root: classes.textFieldClasses },
                startAdornment: hidePhotoFromTextField ? null : (
                  <InputAdornment position="start">
                    {(voterPhotoUrlTiny) ? (
                      <SpeakerAvatar>
                        <ActivityImage src={voterPhotoUrlTiny} alt={`${voterFullName}`} />
                      </SpeakerAvatar>
                    ) : (
                      <SpeakerAvatar>
                        <AccountCircle classes={{ root: classes.accountCircle }} />
                      </SpeakerAvatar>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </AddReplyTextWrapper>
        {showSendButton && (
          <SendButtonWrapper>
            <IconButton
              classes={statementText ? { root: classes.saveCommentActive } : { root: classes.saveComment }}
              disabled={!statementText}
              id={`saveComment-${activityTidbitWeVoteId}`}
              onClick={this.saveActivityComment}
            >
              <Send />
            </IconButton>
          </SendButtonWrapper>
        )}
      </Wrapper>
    );
  }
}

const styles = () => ({
  accountCircle: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
  formControl: {
    margin: 0,
    width: '100%',
  },
  saveComment: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
  saveCommentActive: {
    color: '#2e3c5d',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
  textFieldClasses: {
    margin: 0,
    width: '100%',
  },
});

const AddReplyTextWrapper = styled.div`
  width: 100%;
`;

const ActivityImage = styled.img`
  border-radius: 4px;
  width: 24px;
  height: 24px;
  margin-top: 3px;
`;

const SendButtonWrapper = styled.div`
  width: 22px;
`;

const SpeakerAvatar = styled.div`
  background: transparent;
  display: flex;
  justify-content: center;
  position: relative;
`;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  ${({ commentsExist }) => ((commentsExist) ? 'margin-top: 6px !important;' : 'margin-top: 4px !important;')}
  padding: 0px !important;
`;

export default withTheme(withStyles(styles)(ActivityCommentAdd));
