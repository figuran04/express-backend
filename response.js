const response = (statusCode, data, message, res) => {
  res.json(statusCode, [
    {
      payload: data,
      message,
      metadata: {
        prev: "",
        next: "",
        current: "",
      },
    },
  ]);
};

module.exports = response;
