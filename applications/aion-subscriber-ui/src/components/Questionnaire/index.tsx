import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import PrintIcon from '@material-ui/icons/Print';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { IQuestionnaireSection, QuestionnaireSectionStatus } from '@pec/aion-ui-core/interfaces/questionnaireSection';
import { QuestionnaireMenuItem } from './QuestionnaireMenuItem';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Tile } from 'components/Tile';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';
import { withTranslation } from 'react-i18next';

declare global {
  interface Window {
    NavDDlEvent: (param: string) => void | false;
  }
}

const styles = (theme: Theme) => ({
  iconButton: {
    marginRight: '.5em',
    padding: 0,
    '&:hover': {
      background: 'none'
    }
  },
  scrollable: {
    borderColor: theme.palette.divider,
    borderStyle: 'solid',
    borderWidth: '1px 0 0',
    flex: 1,
    margin: `0 -${theme.spacing(1.5)}px -${theme.spacing(1.5)}px`,
    minWidth: '100%',
    overflow: 'auto',
    '& > [role="button"]': {
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:last-child': {
        border: 'none'
      }
    }
  },
  storminNorman: {
    color: 'cyan',
    marginRight: '.5em',
    textShadow: `1px 0 0 ${theme.palette.text.primary}`
  }
});

type OwnProps = {
  activeSection: IQuestionnaireSection;
  questionnaireSections: DeepReadonly<IQuestionnaireSection[]> | null;
  organizationId: string;
  fetchQuestionnaireSections: () => void;
  fetchRankings: () => void;
  history: History;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

export type State = {
  isLoading: boolean;
};

class Questionnaire extends React.Component<Props, State> {
  iFrameRef: HTMLIFrameElement | null;

  constructor(props: Props) {
    super(props);
    this.iFrameRef = null;
    this.state = {
      isLoading: true
    };
  }

  getLegacySectionId = () => {
    if (this.iFrameRef) {
      const { contentDocument } = this.iFrameRef;
      const hiddenInput = contentDocument!.getElementById('HiddenQuestionSectionID') as HTMLInputElement;
      return hiddenInput && parseInt(hiddenInput.value, 10);
    }
    return null;
  };

  updateURLToMatchIFrame = () => {
    const {
      activeSection: { id },
      history,
      organizationId
    } = this.props;
    const legacySectionId = this.getLegacySectionId();
    if (legacySectionId && id !== legacySectionId) {
      history.replace(`/${organizationId}/questionnaire/${legacySectionId}`);
    }
  };

  handleIFrameLoad = () => {
    this.setState({ isLoading: false });
    this.props.fetchQuestionnaireSections();
    this.props.fetchRankings();
    this.updateURLToMatchIFrame(); // In case iFrame navigated to another section on its own
  };

  changeQuestionnaireSection = (id: number) => {
    if (this.iFrameRef) {
      this.setState({ isLoading: true });
      const legacyDropdown = this.iFrameRef.contentDocument!.getElementById(
        'questionSectionDropdown_NavDDL'
      ) as HTMLSelectElement;
      if (legacyDropdown) {
        legacyDropdown.value = id.toString();
        const result = this.iFrameRef.contentWindow!.NavDDlEvent('questionSectionDropdown_NavDDL');
        if (result === false) {
          this.setState({ isLoading: false });
        }
      } else {
        const { history, organizationId } = this.props;
        history.replace(`/${organizationId}/questionnaire/${id}`);
        this.setIFrameLocation();
      }
    }
  };

  setIFrameLocation = () => {
    const {
      activeSection: { iFrameSource }
    } = this.props;
    const callback = () => {
      if (this.iFrameRef && this.iFrameRef.contentWindow) {
        this.iFrameRef.contentWindow.location.replace(window.location.origin + iFrameSource);
      }
    };
    const timeout = process.env.NODE_ENV === 'development' ? 1500 : 0;
    window.setTimeout(callback, timeout);
  };

  componentDidMount() {
    this.setIFrameLocation();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      activeSection: { id: prevSectionId }
    } = prevProps;
    const legacySectionId = this.getLegacySectionId();
    if (legacySectionId && legacySectionId !== prevSectionId) {
      this.changeQuestionnaireSection(legacySectionId);
    }
  }

  render() {
    const { activeSection, questionnaireSections, classes, t } = this.props;
    const { isLoading } = this.state;

    if (!questionnaireSections) {
      return null;
    }

    const remainingSectionCount = questionnaireSections.filter(
      q => q.status !== QuestionnaireSectionStatus.Complete && !q.isAuditSection
    ).length;

    return (
      <GridContainer style={{ display: 'flex', minHeight: '90%' }}>
        <Grid item xs={3} style={{ display: 'flex', height: '100%' }}>
          <Tile
            isLoading={isLoading}
            primaryText={t('subscriber.questionnaire.sections', 'Sections')}
            actions={
              <React.Fragment>
                <IconButton
                  aria-label="Print"
                  title={t('subscriber.questionnaire.printSections', 'Print all Sections')}
                  href="/SSQV4/PrintSSQAsPDF.aspx"
                  target="_blank"
                  className={classes.iconButton}
                >
                  <PrintIcon />
                </IconButton>
                <Chip
                  label={t('subscriber.questionnaire.sectionsCount', {
                    remainingSectionCount: localizeNumber(remainingSectionCount, t),
                    defaultValue: '{{remainingSectionCount}} left'
                  })}
                />
              </React.Fragment>
            }
          >
            <List disablePadding component="nav" className={classes.scrollable}>
              {questionnaireSections.map(questionnaireSection => (
                <QuestionnaireMenuItem
                  key={questionnaireSection.id}
                  activeSection={activeSection}
                  questionnaireSection={questionnaireSection}
                  changeQuestionnaireSection={this.changeQuestionnaireSection}
                />
              ))}
            </List>
          </Tile>
        </Grid>
        <Grid item xs={9} style={{ display: 'flex' }}>
          <Tile
            isLoading={isLoading}
            primaryText={activeSection.name}
            actions={
              <Chip
                label={
                  <React.Fragment>
                    <span className={classes.storminNorman}>⬤</span>{' '}
                    {t('subscriber.questionnaire.requiredQuestions', 'Questions in blue are required')}
                  </React.Fragment>
                }
              />
            }
          >
            <iframe
              id="questionnaire"
              title={t('subscriber.questionnaire.title', 'Questionnaire section')}
              className={classes.scrollable}
              style={{
                display: isLoading ? 'none' : 'block'
              }}
              data-hj-allow-iframe
              ref={ref => (this.iFrameRef = ref)}
              onLoad={this.handleIFrameLoad}
            />
          </Tile>
        </Grid>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(withTranslation()(Questionnaire));
