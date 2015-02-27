module.exports = {
  actions: {
    CHANGE_VIEW: 'CHANGE_VIEW'
  },
  views: {
    FOUR_OH_FOUR:  'FourOhFour',
    LANDING:       'Landing',
    SEQUENCE_LIST: 'SequenceList',
    SEQUENCE_NEW:  'SequenceNew'
  },
  paths: {
    'FourOhFour':   '/four-oh-four',
    'Landing':      '/',
    'SequenceList': '/sequences',
    'SequenceNew':  '/sequences/new'
  },
  stateActions: {
    NONE:    'view.stateActions.none',
    REPLACE: 'view.stateActions.replace',
    PUSH:    'view.stateActions.push'
  }
};