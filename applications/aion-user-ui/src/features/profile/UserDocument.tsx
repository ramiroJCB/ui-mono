import React from 'react';
import { DeepReadonly } from 'utility-types';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ITrainee } from '@pec/aion-ui-core/interfaces/trainee';
import { ITraineeCourseCredit } from 'interfaces/traineeCourseCredit';
import { localizeDate, localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: `${process.env.PUBLIC_URL}/fonts/Roboto-Light.ttf`, fontWeight: 300 },
    { src: `${process.env.PUBLIC_URL}/fonts/Roboto-Regular.ttf`, fontWeight: 400 },
    { src: `${process.env.PUBLIC_URL}/fonts/Roboto-Medium.ttf`, fontWeight: 500 }
  ]
});

const classes = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
    fontFamily: 'Roboto'
  },
  section: {
    padding: 10
  },
  title: {
    fontSize: 18,
    paddingLeft: 6,
    fontWeight: 'medium'
  },
  headerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  header: {
    fontSize: 14,
    fontWeight: 'medium'
  },
  subheader: {
    fontSize: 12,
    fontWeight: 'normal',
    margin: '6px 0'
  },
  text: {
    fontSize: 10,
    fontWeight: 'light'
  },
  userPhotoContainer: {
    width: 125,
    height: 125
  },
  userPhoto: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    borderRadius: 150
  },
  barcodeContainer: {
    width: 200
  },
  barcode: {
    width: 200,
    height: 110
  },
  barcodeText: {
    fontSize: 10,
    fontWeight: 'medium',
    textAlign: 'center'
  },
  hr: {
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  label: {
    fontSize: 10,
    fontWeight: 'medium',
    paddingRight: 2
  },
  footer: {
    position: 'absolute',
    fontSize: 8,
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  }
});

type Props = {
  trainee: DeepReadonly<ITrainee>;
  traineeCourseCredits: DeepReadonly<ITraineeCourseCredit[]>;
  barcode?: string;
};

export const UserDocument: React.FC<Props> = ({
  trainee: {
    firstName,
    lastName,
    photoUrl,
    pecIdentifier,
    emailAddress,
    phoneNumber,
    emergencyContactName,
    emergencyContactPhoneNumber,
    emergencyContactRelation
  },
  traineeCourseCredits,
  barcode
}) => {
  const { t } = useTranslation();

  return (
    <Document>
      <Page style={classes.page}>
        <View style={classes.section}>
          <View style={classes.headerContainer}>
            <View>
              <Text style={classes.title}>
                {firstName} {lastName}
              </Text>
              <View style={classes.barcodeContainer}>
                {barcode && <Image src={barcode} style={classes.barcode} />}
                <Text style={classes.barcodeText} render={() => pecIdentifier && pecIdentifier} />
              </View>
            </View>
            {photoUrl && (
              <View style={classes.userPhotoContainer}>
                <Image src={photoUrl} style={classes.userPhoto} />
              </View>
            )}
          </View>
        </View>
        <View style={classes.section}>
          <Text style={classes.header}>{t('user.profile.contactInformation', 'Contact Information')}</Text>
          <View style={classes.hr} />
          <Text
            style={classes.subheader}
            render={() => emailAddress && t('user.profile.emailAddress', 'Email Address')}
          />
          <Text style={classes.text} render={() => emailAddress && emailAddress} />
          <Text style={classes.subheader} render={() => phoneNumber && t('user.profile.phoneNumber', 'Phone Number')} />
          <Text style={classes.text} render={() => phoneNumber && phoneNumber} />
          {(emergencyContactName || emergencyContactPhoneNumber || emergencyContactRelation) && (
            <React.Fragment>
              <Text
                style={classes.subheader}
                render={() =>
                  (emergencyContactName || emergencyContactPhoneNumber || emergencyContactRelation) &&
                  t('user.profile.emergencyContactInformation', 'Emergency Contact Information')
                }
              />
              <Text style={classes.text} render={() => emergencyContactRelation && emergencyContactRelation} />
              <Text style={classes.text} render={() => emergencyContactName && emergencyContactName} />
              <Text style={classes.text} render={() => emergencyContactPhoneNumber && emergencyContactPhoneNumber} />
            </React.Fragment>
          )}
        </View>
        <View style={classes.section}>
          <Text style={classes.header}>{t('user.profile.trainingHistory', 'Training History')}</Text>
          <View style={classes.hr} />
          {traineeCourseCredits.length ? (
            traineeCourseCredits.map(
              ({
                trainingCourseId,
                courseName,
                courseExpired,
                completionDate,
                validatingCompanyName,
                trainingLevel
              }) => (
                <React.Fragment key={trainingCourseId + completionDate}>
                  <Text style={classes.subheader}>{courseName}</Text>
                  <View style={classes.labelContainer}>
                    <Text style={classes.label}>{t('user.profile.status', 'Status:')}</Text>
                    <Text style={classes.text}>
                      {courseExpired ? t('user.profile.expired', 'Expired') : t('user.profile.valid', 'Valid')}
                    </Text>
                  </View>
                  <View style={classes.labelContainer}>
                    <Text style={classes.label}>{t('user.profile.dateTaken', 'Date Taken:')}</Text>
                    <Text style={classes.text}>
                      {completionDate
                        ? localizeDate(completionDate, t)
                        : t('user.profile.noneProvided', 'None Provided')}{' '}
                    </Text>
                  </View>
                  <View style={classes.labelContainer}>
                    <Text style={classes.label}>{t('user.profile.validatingCompany', 'Validating Company:')}</Text>
                    <Text style={classes.text}>{validatingCompanyName}</Text>
                  </View>
                  <View style={classes.labelContainer}>
                    <Text style={classes.label}>{t('user.profile.trainingLevel', 'Training Level:')}</Text>
                    <Text style={classes.text}>{trainingLevel}</Text>
                  </View>
                  <View style={classes.hr} />
                </React.Fragment>
              )
            )
          ) : (
            <Text style={{ ...classes.text, paddingTop: 10 }}>
              {t('user.profile.noTraining', 'No training has been associated with this profile.')}
            </Text>
          )}
        </View>
        <View style={classes.footer} fixed>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${localizeNumber(pageNumber || 0, t)} / ${localizeNumber(totalPages || 0, t)}`
            }
            fixed
          />
          <Text fixed>{localizeDate(new Date(), t)}</Text>
        </View>
      </Page>
    </Document>
  );
};
