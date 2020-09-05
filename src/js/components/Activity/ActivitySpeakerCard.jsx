import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ActivityStore from '../../stores/ActivityStore';
import avatarGenericIcon from '../../../img/global/svg-icons/avatar-generic.svg';
import { cordovaDot } from '../../utils/cordovaUtils';
import FriendsOnlyIndicator from '../Widgets/FriendsOnlyIndicator';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import OrganizationPopoverCard from '../Organization/OrganizationPopoverCard';
import StickyPopover from '../Ballot/StickyPopover';
import { numberWithCommas, timeFromDate } from '../../utils/textFormat';
import VoterStore from '../../stores/VoterStore';

class ActivitySpeakerCard extends Component {
  static propTypes = {
    activityTidbitWeVoteId: PropTypes.string.isRequired,
    showTwitterInformation: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      actionDescription: null,
      activityTimeFromDate: '',
      isActivityNoticeSeed: false,
      isActivityPost: false,
      speakerName: '',
      speakerOrganizationWeVoteId: '',
      speakerProfileImageUrlMedium: '',
      speakerTwitterHandle: '',
      speakerTwitterFollowersCount: 0,
      speakerIsVoter: false,
    };
  }

  componentDidMount () {
    this.onActivityStoreChange();
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    const activityTidbit = ActivityStore.getActivityTidbitByWeVoteId(activityTidbitWeVoteId);
    const {
      date_created: dateOfNotice,
      kind_of_activity: kindOfActivity,
      speaker_name: speakerName,
      speaker_organization_we_vote_id: speakerOrganizationWeVoteId,
      speaker_profile_image_url_medium: speakerProfileImageUrlMedium,
      speaker_twitter_handle: speakerTwitterHandle,
      speaker_twitter_followers_count: speakerTwitterFollowersCount,
      speaker_voter_we_vote_id: speakerVoterWeVoteId,
      visibility_is_public: visibilityIsPublic,
    } = activityTidbit;
    const voter = VoterStore.getVoter();
    const speakerIsVoter = (voter.we_vote_id === speakerVoterWeVoteId);
    let isActivityNoticeSeed = false;
    let isActivityPost = false;
    if (kindOfActivity === 'ACTIVITY_NOTICE_SEED') {
      isActivityNoticeSeed = true;
    } else if (kindOfActivity === 'ACTIVITY_POST') {
      isActivityPost = true;
    }
    const activityTimeFromDate = timeFromDate(dateOfNotice);
    const actionDescription = <span>added a new opinion.</span>;
    this.setState({
      actionDescription,
      activityTimeFromDate,
      isActivityNoticeSeed,
      isActivityPost,
      speakerName,
      speakerOrganizationWeVoteId,
      speakerProfileImageUrlMedium,
      speakerTwitterHandle,
      speakerTwitterFollowersCount,
      speakerIsVoter,
      visibilityIsPublic,
    });
  }

  render () {
    renderLog('ActivitySpeakerCard');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitWeVoteId, showTwitterInformation } = this.props;
    const {
      actionDescription, activityTimeFromDate,
      isActivityNoticeSeed, isActivityPost, speakerIsVoter,
      speakerName, speakerOrganizationWeVoteId,
      speakerProfileImageUrlMedium, speakerTwitterFollowersCount, speakerTwitterHandle,
      visibilityIsPublic,
    } = this.state;
    if (!speakerName) {
      return <div>{LoadingWheel}</div>;
    }
    const organizationPopoverCard = (<OrganizationPopoverCard organizationWeVoteId={speakerOrganizationWeVoteId} />);

    // const voterGuideLink = speakerTwitterHandle ? `/${speakerTwitterHandle}` : `/voterguide/${speakerOrganizationWeVoteId}`;

    return (
      <Wrapper>
        <StickyPopover
          delay={{ show: 700, hide: 100 }}
          popoverComponent={organizationPopoverCard}
          placement="auto"
          id={`speakerAvatarOrganizationPopover-${activityTidbitWeVoteId}`}
        >
          {(speakerProfileImageUrlMedium) ? (
            <SpeakerAvatar>
              <ActivityImage src={speakerProfileImageUrlMedium} alt={`${speakerName}`} />
            </SpeakerAvatar>
          ) : (
            <SpeakerAvatar>
              <ActivityImage src={cordovaDot(avatarGenericIcon)} alt={`${speakerName}`} />
            </SpeakerAvatar>
          )}
        </StickyPopover>
        <SpeakerActionTimeWrapper>
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={organizationPopoverCard}
            placement="auto"
            id={`speakerNameOrganizationPopover-${activityTidbitWeVoteId}`}
          >
            <SpeakerAndActionWrapper>
              <SpeakerNameWrapper>
                {speakerIsVoter ? 'You' : speakerName}
              </SpeakerNameWrapper>
              {(actionDescription && isActivityNoticeSeed) && (
                <ActionDescriptionWrapper>
                  {actionDescription}
                </ActionDescriptionWrapper>
              )}
            </SpeakerAndActionWrapper>
          </StickyPopover>
          <SecondLineWrapper>
            <TimeAndFriendsOnlyWrapper>
              {(activityTimeFromDate) && (
                <ActivityTime>
                  {activityTimeFromDate}
                </ActivityTime>
              )}
              {(isActivityPost) && (
                <FriendsOnlyIndicator isFriendsOnly={!visibilityIsPublic} />
              )}
            </TimeAndFriendsOnlyWrapper>
            {(speakerTwitterHandle && showTwitterInformation) && (
              <OpenExternalWebSite
                linkIdAttribute="speakerTwitterHandle"
                url={`https://twitter.com/${speakerTwitterHandle}`}
                target="_blank"
                body={(
                  <TwitterName>
                    <TwitterHandleWrapper>
                      @
                      {speakerTwitterHandle}
                    </TwitterHandleWrapper>
                    { !!(speakerTwitterFollowersCount && String(speakerTwitterFollowersCount) !== '0') && (
                      <span className="twitter-followers__badge">
                        <span className="fab fa-twitter twitter-followers__icon" />
                        {numberWithCommas(speakerTwitterFollowersCount)}
                      </span>
                    )}
                  </TwitterName>
                )}
              />
            )}
          </SecondLineWrapper>
        </SpeakerActionTimeWrapper>
      </Wrapper>
    );
  }
}

const ActionDescriptionWrapper = styled.div`
  font-size: 14px;
  margin-left: 3px;
  padding: 0px !important;
  vertical-align: middle;
`;

const ActivityImage = styled.img`
  border-radius: 4px;
  width: 50px;
`;

const ActivityTime = styled.div`
  color: #999;
  font-size: 11px;
  font-weight: 400;
  margin-right: 6px;
`;

const SpeakerAvatar = styled.div`
  background: transparent;
  display: flex;
  justify-content: center;
  position: relative;
`;

const SecondLineWrapper = styled.div`
`;

const SpeakerActionTimeWrapper = styled.div`
  margin-left: 6px;
`;

const SpeakerAndActionWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: start;
`;

const SpeakerNameWrapper = styled.div`
  font-size: 18px;
  font-weight: 700;
  padding: 0px !important;
  vertical-align: middle;
`;

const TimeAndFriendsOnlyWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: start;
`;

const TwitterHandleWrapper = styled.span`
  margin-right: 10px;
`;

const TwitterName = styled.span`
`;

const Wrapper = styled.div`
  align-items: flex-start;
  display: flex;
  font-size: 14px;
  justify-content: start;
  padding: 0px !important;
`;

export default ActivitySpeakerCard;
