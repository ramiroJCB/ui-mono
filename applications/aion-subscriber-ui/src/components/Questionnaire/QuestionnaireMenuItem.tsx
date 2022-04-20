import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { QuestionnaireMenuItemContent } from './QuestionnaireMenuItemContent';
import { IQuestionnaireSection } from '@pec/aion-ui-core/interfaces/questionnaireSection';

type Props = {
  activeSection: IQuestionnaireSection;
  questionnaireSection: IQuestionnaireSection;
  changeQuestionnaireSection: (id: number) => void;
};

export class QuestionnaireMenuItem extends React.Component<Props> {
  handleClick = () => {
    const { changeQuestionnaireSection, questionnaireSection } = this.props;
    changeQuestionnaireSection(questionnaireSection.id);
  };

  render() {
    const { activeSection, questionnaireSection } = this.props;
    return (
      <ListItem
        button
        onClick={this.handleClick}
        selected={activeSection && questionnaireSection.id === activeSection.id}
      >
        <QuestionnaireMenuItemContent {...questionnaireSection} />
      </ListItem>
    );
  }
}
