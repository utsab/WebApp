import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import SettingsWidgetAccountType from './SettingsWidgetAccountType';
import SettingsWidgetFirstLastName from './SettingsWidgetFirstLastName';
import SettingsWidgetOrganizationDescription from './SettingsWidgetOrganizationDescription';
import SettingsWidgetOrganizationWebsite from './SettingsWidgetOrganizationWebsite';
import VoterStore from '../../stores/VoterStore';


export default class SettingsProfile extends Component {
  static propTypes = {
    externalUniqueId: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
  };

  render () {
    renderLog('SettingsProfile');  // Set LOG_RENDER_EVENTS to log all renders
    const { externalUniqueId } = this.props;

    if (!this.state.voter) {
      return LoadingWheel;
    }

    return (
      <div className="">
        <Helmet title="General Settings - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card u-padding-bottom--lg">
          <div className="card-main">
            <h1 className="h2">General Settings</h1>
            <div>
              <SettingsWidgetFirstLastName externalUniqueId={externalUniqueId} />
              <SettingsWidgetOrganizationWebsite externalUniqueId={externalUniqueId} />
              <SettingsWidgetOrganizationDescription externalUniqueId={externalUniqueId} />
              <SettingsWidgetAccountType
                externalUniqueId={externalUniqueId}
                closeEditFormOnChoice
                showEditToggleOption
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
