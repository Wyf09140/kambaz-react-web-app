import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

export default function Profile() {
  return (
    <div className="d-flex justify-content-center mt-5">
      <div style={{ width: "300px" }}>
        <h3 className="mb-3">Profile</h3>
        <Form>
          <Form.Control
            defaultValue="alice"
            placeholder="username"
            className="mb-2"
          />
          <Form.Control
            defaultValue="123"
            type="password"
            placeholder="password"
            className="mb-2"
          />
          <Form.Control
            defaultValue="Alice"
            placeholder="First Name"
            className="mb-2"
          />
          <Form.Control
            defaultValue="Wonderland"
            placeholder="Last Name"
            className="mb-2"
          />
          <Form.Control
            defaultValue="2000-01-01"
            type="date"
            className="mb-2"
          />
          <Form.Control
            defaultValue="alice@wonderland"
            type="email"
            placeholder="Email"
            className="mb-2"
          />
          <Form.Select defaultValue="FACULTY" className="mb-3">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </Form.Select>

          <Link to="/Kambaz/Account/Signin">
            <Button variant="danger" className="w-100">
              Signout
            </Button>
          </Link>
        </Form>
      </div>
    </div>
  );
}
