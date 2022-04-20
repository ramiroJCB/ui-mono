import * as React from 'react';
import { connect } from 'react-redux';
import { EnvelopesComponent } from '../components/Envelopes';
import { fetchEnvelopesIfNeeded } from '../actions/fetchEnvelopes';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type Props = RouteComponentProps<RouteParams> &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const mapStateToProps = (state: RootState) => state.envelopes;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps<RouteParams>
) => ({
  fetchEnvelopesIfNeeded: (isClientOrg: boolean, organizationId: string) =>
    dispatch(fetchEnvelopesIfNeeded(isClientOrg, organizationId, parse(search)))
});

class Envelopes extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    const {
      match: {
        params: { organizationId }
      }
    } = props;

    props.fetchEnvelopesIfNeeded(false, organizationId);
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search },
      match: {
        params: { organizationId }
      }
    } = this.props;

    if (prevSearch !== search) {
      this.props.fetchEnvelopesIfNeeded(false, organizationId);
    }
  }

  handleEnvelopeSelect = (envelopeId: string) => {
    const {
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    history.push(`/${organizationId}/esignatures/documents/${envelopeId}`);
  };

  render() {
    const {
      match: {
        params: { organizationId }
      },
      envelopes,
      totalCount,
      isFetching
    } = this.props;

    return (
      <EnvelopesComponent
        organizationId={organizationId}
        isClientOrg={false}
        envelopes={envelopes}
        isFetchingData={isFetching}
        totalOptionsCount={totalCount}
        onEnvelopeSelect={this.handleEnvelopeSelect}
      />
    );
  }
}

export const ContractorEnvelopesContainer = connect(mapStateToProps, mapDispatchToProps)(Envelopes);
