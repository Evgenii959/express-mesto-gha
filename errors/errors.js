const codeMessage = {
  succes: 'Успешная авторизация',
  serverError: 'Server Error',
  userNotFound: 'User not found',
  falseId: 'false ID',
  falseData: 'Переданы некорректные данные',
  cardNotFound: 'Card not found',
  falseAdress: 'Неверный адрес',
};

const ERROR_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
};

module.exports = {
  codeMessage,
  ERROR_CODES,
};
