import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { ThumbUp } from '@material-ui/icons';
import ActivityStore from '../../stores/ActivityStore';
import AppActions from '../../actions/AppActions';
import { renderLog } from '../../utils/logging';
import ReactionStore from '../../stores/ReactionStore';
import StickyPopover from '../Ballot/StickyPopover';


class ActivityTidbitReactionsSummary extends Component {
  static propTypes = {
    activityTidbitWeVoteId: PropTypes.string.isRequired,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      numberOfComments: 0,
      numberOfLikes: 0,
      // namesOfLikesList: [],
    };
  }

  componentDidMount () {
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    this.reactionStoreListener = ReactionStore.addListener(this.onReactionStoreChange.bind(this));
    this.onActivityStoreChange();
    this.onReactionStoreChange();
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
    this.reactionStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    const numberOfComments = ActivityStore.getActivityCommentAllCountByTidbitWeVoteId(activityTidbitWeVoteId);
    this.setState({
      numberOfComments,
    });
  }

  onReactionStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('ActivityTidbitReactionsSummary onReactionStoreChange, activityTidbitWeVoteId:', activityTidbitWeVoteId);
    const voterWeVoteIdsWhoLikedThisActivityTidbit = ReactionStore.getVoterWeVoteIdListByLikedItemWeVoteId(activityTidbitWeVoteId);
    const reactionLikesList = ReactionStore.getReactionLikesByLikedItemWeVoteId(activityTidbitWeVoteId);
    const numberOfLikes = voterWeVoteIdsWhoLikedThisActivityTidbit.length;
    this.setState({
      reactionLikesList,
      numberOfLikes,
    });
  }

  onClickShowActivityTidbitDrawer = () => {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('onClickShowActivityTidbitDrawer activityTidbitWeVoteId:', activityTidbitWeVoteId);
    AppActions.setActivityTidbitWeVoteIdForDrawer(activityTidbitWeVoteId);
    AppActions.setShowActivityTidbitDrawer(true);
  }

  render () {
    renderLog('ActivityTidbitReactionsSummary');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitWeVoteId, classes } = this.props;
    const { numberOfComments, numberOfLikes, reactionLikesList } = this.state;
    if (!activityTidbitWeVoteId || numberOfLikes === 0) {
      return null;
    }
    const likesSummaryPopover = (
      <PopoverWrapper>
        <PopoverHeader>
          <PopoverTitleText>
            Who Liked
            {' '}
          </PopoverTitleText>
        </PopoverHeader>
        <PopoverBody>
          {reactionLikesList.map(reactionLike => (
            <div key={`voterNameLiked-${reactionLike.voter_we_vote_id}-${activityTidbitWeVoteId}`}>{reactionLike.voter_display_name}</div>
          ))}
        </PopoverBody>
      </PopoverWrapper>
    );

    return (
      <Wrapper>
        <LeftColumnWrapper>
          {(numberOfLikes) && (
            <LikeWrapper>
              <StickyPopover
                // delay={{ show: 700, hide: 100 }}
                popoverComponent={likesSummaryPopover}
                placement="bottom"
                id={`likesSummaryPopover-${activityTidbitWeVoteId}`}
                openOnClick
                // openPopoverByProp={openSupportOpposeCountDisplayModal}
                // closePopoverByProp={closeSupportOpposeCountDisplayModal}
                showCloseIcon
              >
                <IconButton
                  classes={{ root: classes.numberOfLikesButton }}
                  id={`numberOfLikes-${activityTidbitWeVoteId}`}
                >
                  <ThumbUp classes={{ root: classes.likeIcon }} />
                  <LikeTextWrapper>
                    {numberOfLikes}
                  </LikeTextWrapper>
                </IconButton>
              </StickyPopover>
            </LikeWrapper>
          )}
        </LeftColumnWrapper>
        <RightColumnWrapper>
          {!!(numberOfComments) && (
            <CommentWrapper>
              <IconButton
                classes={{ root: classes.numberOfCommentsButton }}
                id={`numberOfComments-${activityTidbitWeVoteId}`}
                onClick={this.onClickShowActivityTidbitDrawer}
              >
                <CommentTextWrapper>
                  {numberOfComments}
                  {' '}
                  Comment
                  {numberOfComments === 1 ? '' : 's'}
                </CommentTextWrapper>
              </IconButton>
            </CommentWrapper>
          )}
        </RightColumnWrapper>
      </Wrapper>
    );
  }
}

const styles = () => ({
  likeIcon: {
    color: '#fff',
    width: 12,
    height: 12,
  },
  numberOfLikesButton: {
    backgroundColor: 'rgb(200, 200, 200)',
    borderRadius: 12,
    marginBottom: 2,
    padding: '2px 5px',
    '&:hover': {
      backgroundColor: '#2e3c5d',
    },
  },
  numberOfCommentsButton: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
});

const LeftColumnWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const RightColumnWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const CommentWrapper = styled.div`
`;

const CommentTextWrapper = styled.div`
  font-size: 10px;
  padding-left: 4px;
`;

const LikeTextWrapper = styled.div`
  color: #fff; // #1fc06f
  font-size: 10px;
  font-weight: 500;
  padding-left: 4px;
`;

const LikeWrapper = styled.div`
`;

const PopoverWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const PopoverHeader = styled.div`
  background: ${({ theme }) => theme.colors.brandBlue};
  padding: 4px 8px;
  min-height: 35px;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

const PopoverTitleText = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-right: 20px;
`;

const PopoverBody = styled.div`
  padding: 8px;
  border-left: .5px solid #ddd;
  border-right: .5px solid #ddd;
  border-bottom: .5px solid #ddd;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const Wrapper = styled.div`
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0px !important;
  padding: 0px !important;
`;

export default withTheme(withStyles(styles)(ActivityTidbitReactionsSummary));
