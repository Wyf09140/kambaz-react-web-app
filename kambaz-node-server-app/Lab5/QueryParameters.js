export default function QueryParameters(app) {
  app.get("/lab5/calculator", (req, res) => {
    const { a, b, operation } = req.query;
    let result = 0;

    switch (operation) {
      case "add":
        result = parseInt(a) + parseInt(b);
        break;
      case "subtract":
        result = parseInt(a) - parseInt(b);
        break;
      case "multiply":
        result = parseInt(a) * parseInt(b);
        break;
      case "divide":
        result = parseInt(b) !== 0 ? parseInt(a) / parseInt(b) : "Cannot divide by 0";
        break;
      default:
        result = "Invalid operation";
    }

    res.send(result.toString());
  });
}
