import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React, { useEffect, useState } from 'react';
import { AutoSizer, List, ListRowProps, WindowScroller } from 'react-virtualized';
import { Box, Divider, Grid, Typography } from '@material-ui/core';
import { BulkSelectButton } from '@pec/aion-ui-components/components/BulkSelectButton';
import { fetchServiceRegionServices } from './slice';
import { FilterField } from '@pec/aion-ui-components/components/FilterField';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IServiceListItem } from 'interfaces/scoreSetService';

type RouteParams = {
  serviceRegionId: string;
};

type Props = {
  value: IServiceListItem[];
  onChange: (value: IServiceListItem[]) => void;
};

export const ServicesList: React.FC<Props> = ({ value: selectedServices, onChange }) => {
  const { serviceRegionId } = useParams<RouteParams>();
  const { serviceRegionServices } = useTypedSelector(state => state.scoreSet);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const services: IServiceListItem[] =
    serviceRegionServices?.map(({ serviceId, serviceName }) => {
      return { id: serviceId, name: serviceName };
    }) || [];

  const [lastClickedId, setLastClickedId] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    dispatch(fetchServiceRegionServices(serviceRegionId));
  }, [dispatch, serviceRegionId]);

  const filteredServices = services.filter(({ name }) => name.toLowerCase().includes(filterTerm.toLowerCase()));

  const handleClick = (service: IServiceListItem) => ({ shiftKey }: React.MouseEvent) => {
    let servicesList: IServiceListItem[] = [];

    if (shiftKey && lastClickedId) {
      const allIds = filteredServices.map(({ id }) => id);
      const currentIndex = allIds.indexOf(service.id);
      const prevIndex = allIds.indexOf(lastClickedId);
      const [start, end] = [currentIndex, prevIndex].sort((a, b) => a - b);

      servicesList = filteredServices.slice(start, end + 1);
    } else {
      servicesList = [service];
    }

    const selectedServicesIds = selectedServices.map(({ id }) => id);
    const servicesListIds = servicesList.map(({ id }) => id);
    const newServices = selectedServicesIds.includes(service.id)
      ? selectedServices.filter(({ id }) => !servicesListIds.includes(id))
      : selectedServices.concat(servicesList.filter(({ id }) => !selectedServicesIds.includes(id)));
    onChange(newServices);
    setLastClickedId(service.id);
  };

  const handleBlur = ({ relatedTarget }: React.FocusEvent<HTMLElement>) => {
    if (!relatedTarget) {
      setLastClickedId('');
    }
  };

  const handleChangeFilter = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setFilterTerm(value);

  const handleResetFilter = () => setFilterTerm('');

  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const service = filteredServices[index];
    const selected = selectedServices.some(({ id }) => id === service.id);

    return (
      <ListItem
        key={key}
        style={style}
        button
        dense
        divider
        selected={selected}
        onClick={handleClick(service)}
        onBlur={handleBlur}
      >
        <ListItemIcon>
          {selected ? (
            <CheckBoxIcon color="primary" />
          ) : (
            <CheckBoxOutlineBlankIcon color={service.id === lastClickedId ? 'primary' : undefined} />
          )}
        </ListItemIcon>
        <ListItemText primary={service.name} primaryTypographyProps={{ noWrap: true }} title={service.name} />
      </ListItem>
    );
  };

  const noRowsRenderer = () => (
    <ListItem divider style={{ justifyContent: 'center' }}>
      {t('scoring.servicesList.noResultsFound', 'No results found. Please refine your filter.')}
    </ListItem>
  );

  return (
    <>
      <Box ml={0.5} mb={1}>
        <GridContainer spacing={0}>
          <Grid item xs={6}>
            <GridContainer spacing={0} alignItems="baseline">
              <Grid item>
                <BulkSelectButton
                  allAreSelected={selectedServices.length === services.length}
                  anyAreSelected={selectedServices.length > 0}
                  handleSelectAll={() => onChange(filteredServices)}
                  handleSelectNone={() => onChange([])}
                />
              </Grid>
              <Grid item style={{ flex: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {t('scoring.servicesList.tip', 'Tip: Use shift-click to select multiple rows.')}
                </Typography>
              </Grid>
            </GridContainer>
          </Grid>
          <Grid item xs={6}>
            <FilterField value={filterTerm} handleChange={handleChangeFilter} handleReset={handleResetFilter} />
          </Grid>
        </GridContainer>
      </Box>
      <Divider />
      <WindowScroller>
        {({ isScrolling, onChildScroll }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                height={300}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={filteredServices.length}
                rowHeight={37}
                rowRenderer={rowRenderer}
                noRowsRenderer={noRowsRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </>
  );
};
