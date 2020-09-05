import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SuggestedFriendList from './SuggestedFriendList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';

export default class SuggestedFriendsPreview extends Component {
  static propTypes = {
    inSideColumn: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.onFriendStoreChange();
    FriendActions.suggestedFriendList();
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    const suggestedFriendList = FriendStore.suggestedFriendList();
    // suggestedFriendList.sort((optionA, optionB) => (optionB.voter_photo_url_medium ? 1 : 0) - (optionA.voter_photo_url_medium ? 1 : 0));
    // suggestedFriendList.sort((optionA, optionB) => optionB.positions_taken - optionA.positions_taken);
    suggestedFriendList.sort((optionA, optionB) => optionB.voter_date_last_changed - optionA.voter_date_last_changed);
    suggestedFriendList.sort((optionA, optionB) => optionB.mutual_friends - optionA.mutual_friends);
    // console.log('suggestedFriendList:', suggestedFriendList);
    this.setState({
      suggestedFriendList,
    });
  }

  render () {
    renderLog('SuggestedFriendsPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { inSideColumn } = this.props;
    const { suggestedFriendList } = this.state;
    if (!suggestedFriendList || !(suggestedFriendList.length > 0)) {
      return null;
    }

    const FRIENDS_TO_SHOW = 3;
    const suggestedFriendListLimited = suggestedFriendList.slice(0, FRIENDS_TO_SHOW);

    return (!!(suggestedFriendListLimited && suggestedFriendListLimited.length > 0) && (
      <div className="opinion-view">
        <section className="card">
          <div className="card-main">
            <SectionTitle>
              People You May Know
              {' '}
              (
              {suggestedFriendList.length}
              )
            </SectionTitle>
            <div>
              <SuggestedFriendList
                friendList={suggestedFriendListLimited}
                inSideColumn={inSideColumn}
                previewMode
              />
              {suggestedFriendList.length > FRIENDS_TO_SHOW && <Link to="/friends/suggested">See All</Link>}
            </div>
          </div>
        </section>
      </div>
    ));
  }
}

const SectionTitle = styled.h2`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
  width: fit-content;
`;
