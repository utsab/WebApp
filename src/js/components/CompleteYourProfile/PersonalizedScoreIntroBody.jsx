import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import CandidateItem from '../Ballot/CandidateItem';
import { hideZenDeskHelpVisibility, setZenDeskHelpVisibility } from '../../utils/applicationUtils';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';

class PersonalizedScoreIntroBody extends Component {
  static propTypes = {
    classes: PropTypes.object,
    inModal: PropTypes.bool,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      previousStep: false,
      currentStep: 1,
      nextStep: 2,
      actionButtonText: '',
      controlAdviserMaterialUIPopoverFromProp: false,
      explanationTextTopPlain: null,
      explanationTextTopBlue: null,
      explanationTextBottomPlain: null,
      explanationTextBottomBlue: null,
      openAdviserMaterialUIPopover: false,
      openSupportOpposeCountDisplayModal: false,
      pathname: '',
      supportOpposeCountDisplayModalTutorialOn: true,
      supportOpposeCountDisplayModalTutorialText: null,
      showPersonalizedScoreDownArrow: false,
      showPersonalizedScoreUpArrow: false,
      showPersonalizedScoreIntroCompletedButton: false,
      personalizedScoreSteps: {
        1: {
          previousStep: false,
          currentStep: 1,
          nextStep: 2,
          actionButtonText: 'Say What?!?',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: null,
          explanationTextTopBlue: <>A Personalized Score is the number of people who support a candidate.</>,
          explanationTextBottomPlain: <>(We&apos;ll explain! Click the button below to continue.)</>,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        2: {
          previousStep: 1,
          currentStep: 2,
          nextStep: 3,
          actionButtonText: 'Next >',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: null,
          explanationTextTopBlue: <>In this example, you have a Personalized Score of &quot;+3&quot; for the historical candidate &quot;Alexander Hamilton&quot;.</>,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: true,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        3: {
          previousStep: 2,
          currentStep: 3,
          nextStep: 4,
          actionButtonText: 'Tell Me!',
          closeSupportOpposeCountDisplayModal: true,
          explanationTextTopPlain: <>But how is the +3 calculated?</>,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: true,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        4: {
          previousStep: 3,
          currentStep: 4,
          nextStep: 5,
          actionButtonText: 'I\'ll Pretend',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: <>But how is the +3 calculated?</>,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: <>In this example, we pretend you are following 3 advisers.</>,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: true,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        5: {
          previousStep: 4,
          currentStep: 5,
          nextStep: 6,
          actionButtonText: 'Next >',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: <>But how is the +3 calculated?</>,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: <>Out of those people, we count the number who support Alexander Hamilton. We pretend all 3 support him.</>,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: true,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        6: {
          previousStep: 5,
          currentStep: 6,
          nextStep: 7,
          actionButtonText: 'Show',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: null,
          explanationTextTopBlue: <>So, your Personalized Score is the number of people who support Alexander Hamilton, from among the people you follow.</>,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: true,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        7: {
          previousStep: 6,
          currentStep: 7,
          nextStep: 8,
          actionButtonText: 'Next >',
          closeSupportOpposeCountDisplayModal: false,
          controlAdviserMaterialUIPopoverFromProp: true,
          explanationTextTopPlain: null,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: true,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: <>These are the people and groups who support Alexander Hamilton.</>,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        8: {
          previousStep: 7,
          currentStep: 8,
          nextStep: 9,
          actionButtonText: 'Next >',
          closeSupportOpposeCountDisplayModal: false,
          controlAdviserMaterialUIPopoverFromProp: true,
          explanationTextTopPlain: null,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: true,
          openSupportOpposeCountDisplayModal: true,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: <>You can click on any adviser to see why they are part of your Personalized Score.</>,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        9: {
          previousStep: 8,
          currentStep: 9,
          nextStep: 10,
          actionButtonText: 'Got It!',
          closeSupportOpposeCountDisplayModal: false,
          controlAdviserMaterialUIPopoverFromProp: true,
          explanationTextTopPlain: null,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: true,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: <>Click the +3 any time to see your Personalized Score explained.</>,
          showPersonalizedScoreDownArrow: true,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        10: {
          previousStep: 9,
          currentStep: 10,
          nextStep: false,
          actionButtonText: 'All Done!',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: null,
          explanationTextTopBlue: <>Success! Now you know what a personalized score is:</>,
          explanationTextBottomPlain: (
            <>
              A
              {' '}
              <strong>
                Personalized Score
              </strong>
              {' '}
              is the number of friends, public figures or groups who support one candidate, from among the people you follow.
            </>
          ),
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: false,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: true,
        },
      },
    };
  }

  componentDidMount () {
    // Step 1 settings
    const { personalizedScoreSteps } = this.state;
    this.setState(personalizedScoreSteps[1]);
    this.setState({
      pathname: this.props.pathname,
    });
    if (this.props.show) {
      hideZenDeskHelpVisibility();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.show) {
      hideZenDeskHelpVisibility();
    } else {
      setZenDeskHelpVisibility(this.props.pathname);
    }
  }

  componentWillUnmount () {
    setZenDeskHelpVisibility(this.props.pathname);
  }

  closeThisModal = () => {
    setZenDeskHelpVisibility(this.props.pathname);
    const { currentStep } = this.state;
    const currentStepCompletedThreshold = 8;
    if (currentStep >= currentStepCompletedThreshold) {
      // console.log('currentStepCompletedThreshold passed');
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    }
    this.props.toggleFunction(this.state.pathname);
  };

  personalizedScoreIntroCompleted = () => {
    // Mark this so we know to show 'How it Works' as completed
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.props.toggleFunction(this.state.pathname);
  };

  clickNextStepButton = () => {
    const {
      nextStep, personalizedScoreSteps,
    } = this.state;
    // console.log('clickNextStepButton, nextStep:', nextStep);
    if (nextStep) {
      this.setState(personalizedScoreSteps[nextStep]);
    }
  };

  clickPreviousStepButton = () => {
    const {
      previousStep, personalizedScoreSteps,
    } = this.state;
    // console.log('clickPreviousStepButton, previousStep:', previousStep);
    if (previousStep) {
      this.setState(personalizedScoreSteps[previousStep]);
    }
  };

  render () {
    renderLog('PersonalizedScoreIntroBody');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, inModal } = this.props;
    const {
      actionButtonText, closeSupportOpposeCountDisplayModal, controlAdviserMaterialUIPopoverFromProp,
      explanationTextBottomBlue, explanationTextBottomPlain,
      explanationTextTopBlue, explanationTextTopPlain, showPersonalizedScoreIntroCompletedButton,
      nextStep, openAdviserMaterialUIPopover, openSupportOpposeCountDisplayModal,
      supportOpposeCountDisplayModalTutorialOn, supportOpposeCountDisplayModalTutorialText,
      previousStep,
      showPersonalizedScoreDownArrow, showPersonalizedScoreUpArrow,
    } = this.state;

    return (
      <>
        <PersonalizedScoreIntroBodyWrapper>
          <div className="full-width">
            <ScrollableContentWrapper>
              <CandidateItemOuterWrapper>
                <CandidateItem
                  candidateWeVoteId="candidateAlexanderHamilton"
                  closeSupportOpposeCountDisplayModal={closeSupportOpposeCountDisplayModal}
                  controlAdviserMaterialUIPopoverFromProp={controlAdviserMaterialUIPopoverFromProp}
                  hideBallotItemSupportOpposeComment
                  hideCandidateText
                  hideCandidateUrl
                  hideIssuesRelatedToCandidate
                  hideShowMoreFooter
                  openAdviserMaterialUIPopover={openAdviserMaterialUIPopover}
                  openSupportOpposeCountDisplayModal={openSupportOpposeCountDisplayModal}
                  supportOpposeCountDisplayModalTutorialOn={supportOpposeCountDisplayModalTutorialOn}
                  supportOpposeCountDisplayModalTutorialText={supportOpposeCountDisplayModalTutorialText}
                  showDownArrow={showPersonalizedScoreDownArrow}
                  showUpArrow={showPersonalizedScoreUpArrow}
                  showLargeImage
                  showOfficeName
                />
              </CandidateItemOuterWrapper>
              <ExplanationTextTop>
                {explanationTextTopBlue && (
                  <div
                    style={{
                      color: '#2e3c5d',
                      fontSize: '18px',
                      fontWeight: 600,
                      margin: '6px 0 0 0',
                    }}
                  >
                    {explanationTextTopBlue}
                  </div>
                )}
                {explanationTextTopPlain && (
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 200,
                      margin: '6px 0 0 0',
                    }}
                  >
                    {explanationTextTopPlain}
                  </div>
                )}
              </ExplanationTextTop>
              <ExplanationTextBottom>
                {explanationTextBottomBlue && (
                  <div
                    style={{
                      color: '#2e3c5d',
                      fontSize: '18px',
                      fontWeight: 600,
                      margin: '6px 0 0 0',
                    }}
                  >
                    {explanationTextBottomBlue}
                  </div>
                )}
                {explanationTextBottomPlain && (
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 200,
                      margin: '6px 0 0 0',
                    }}
                  >
                    {explanationTextBottomPlain}
                  </div>
                )}
              </ExplanationTextBottom>
            </ScrollableContentWrapper>
            <ContinueButtonWrapper inModal={inModal}>
              <TwoButtonsWrapper inModal={inModal}>
                <OneButtonWrapper inModal={inModal}>
                  <Button
                    classes={{ root: classes.backButtonRoot }}
                    color="primary"
                    disabled={!(previousStep)}
                    fullWidth
                    id="personalizedScoreIntroModalBackButton"
                    onClick={this.clickPreviousStepButton}
                    variant="outlined"
                  >
                    Back
                  </Button>
                </OneButtonWrapper>
                <OneButtonWrapper inModal={inModal}>
                  <Button
                    classes={{ root: classes.nextButtonRoot }}
                    color="primary"
                    id="personalizedScoreIntroModalNextButton"
                    disabled={!(nextStep || (showPersonalizedScoreIntroCompletedButton && inModal))}
                    variant="contained"
                    onClick={showPersonalizedScoreIntroCompletedButton ? this.personalizedScoreIntroCompleted : this.clickNextStepButton}
                  >
                    <span className="u-no-break">{actionButtonText}</span>
                  </Button>
                </OneButtonWrapper>
              </TwoButtonsWrapper>
            </ContinueButtonWrapper>
          </div>
        </PersonalizedScoreIntroBodyWrapper>
      </>
    );
  }
}
const styles = () => ({
  backButtonRoot: {
    width: '85%',
  },
  nextButtonRoot: {
    width: '90%',
  },
});

const CandidateItemOuterWrapper = styled.div`
`;

const ContinueButtonWrapper = styled.div`
  align-items: center;
  background: #fff;
  border-top: 1px solid #eee;
  ${({ inModal }) => (inModal ? 'bottom: 0;' : '')}
  display: flex;
  justify-content: space-between;
  ${({ inModal }) => (inModal ? 'margin: 0 !important;' : '')}
  ${({ inModal }) => (inModal ? 'position: absolute;' : '')}
  ${({ inModal }) => (inModal ? 'width: 90%;' : '')}
  height: 50px;
`;

const ExplanationTextBottom = styled.div`
`;

const ExplanationTextTop = styled.div`
`;

const OneButtonWrapper = styled.div`
  ${({ inModal }) => (inModal ? 'width: 90%;' : '')}
`;

const PersonalizedScoreIntroBodyWrapper = styled.div`
`;

const ScrollableContentWrapper = styled.div`
  padding-bottom: 60px;
  overflow-y: auto;
`;

const TwoButtonsWrapper = styled.div`
  align-items: center;
  display: flex;
  ${({ inModal }) => (inModal ? 'justify-content: space-between;' : 'justify-content: center;')}
  margin: 0;
  padding: 4px 0 0 0;
  width: 100%;
`;

export default withTheme(withStyles(styles)(PersonalizedScoreIntroBody));
