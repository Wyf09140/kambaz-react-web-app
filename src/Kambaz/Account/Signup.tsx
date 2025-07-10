import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

export default function Signup() {
  return (
    <div className="container mt-4">
      <h4 className="mb-3">Signup</h4>
      <Form>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="username" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control type="password" placeholder="password" />
        </Form.Group>

        <Button className="w-100 mb-2" variant="primary">Signup</Button>

        <div>
          <Link to="/Kambaz/Account/Signin">Signin</Link>
        </div>
      </Form>
    </div>
  );
}
