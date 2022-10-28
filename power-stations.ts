export const stations = [
  {
    name: 'Hawes',
    watchStep: 15,
    format: {
      type: 'json',
      properties: {
        start: 'start',
        end: 'end',
        value: 'power'
      }
    }
  },
  {
    name: 'Barnsley',
    watchStep: 30,
    format: {
      type: 'json',
      properties: {
        start: 'start_time',
        end: 'end_time',
        value: 'value'
      }
    }
  },
  {
    name: 'Hounslow',
    watchStep: 60,
    format: {
      type: 'csv',
      properties: {
        start: 'debut',
        end: 'fin',
        value: 'valeur'
      }
    }
  },
];
