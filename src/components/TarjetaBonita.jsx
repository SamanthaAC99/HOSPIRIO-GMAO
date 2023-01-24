import React from "react";
// react-bootstrap components
import {
  Card,
  Row,
  Col
} from "react-bootstrap";

export default function DashboardT({titulo,valor}) {
  return (
    <>
      <Row>
        <Col md="6">
          <Card className="card-stats">
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-chart text-warning"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                  {valor}
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <hr></hr>
              <div className="stats">
                <i className="fas fa-redo mr-1"></i>
                {titulo}
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </>
  );
}

