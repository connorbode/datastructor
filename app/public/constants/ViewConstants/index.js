module.exports = {
  actions: {
    CHANGE_VIEW: 'CHANGE_VIEW'
  },
  views: {
    DATA_STRUCTURE_EDIT:  'DataStructureEdit',
    DATA_STRUCTURE_LIST:  'DataStructureList',
    DATA_STRUCTURE_NEW:   'DataStructureNew',
    FOUR_OH_FOUR:         'FourOhFour',
    LANDING:              'Landing',
    SEQUENCE_LIST:        'SequenceList',
    SEQUENCE_NEW:         'SequenceNew',
    SEQUENCE_EDIT:        'SequenceEdit'
  },
  paths: {
    'DataStructureEdit':  '/data-structures/:id/edit',
    'DataStructureList':  '/data-structures',
    'DataStructureNew':   '/data-structures/new',
    'FourOhFour':         '/four-oh-four',
    'Landing':            '/',
    'SequenceList':       '/sequences',
    'SequenceNew':        '/sequences/new',
    'SequenceEdit':       '/sequences/:id/edit'
  },
  stateActions: {
    NONE:    'view.stateActions.none',
    REPLACE: 'view.stateActions.replace',
    PUSH:    'view.stateActions.push'
  }
};