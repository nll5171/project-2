const React = require('react');
const Container = require('react-bootstrap/Container');
const Nav = require('react-bootstrap/Nav');
const Navbar = require('react-bootstrap/Navbar');
const Button = require('react-bootstrap/Button');

const LoginOptions = (props) => {
    if (props.loggedIn) {
        return (
            <Nav>
                <Nav.Link href='/changePass'>Change Password</Nav.Link>
                <Nav.Link href='/logout'>Logout</Nav.Link>
            </Nav>
        );
    }

    return (
        <Nav>
            <Nav.Link href='/login'>Login</Nav.Link>
            <Button href='/signup' variant='secondary'>Sign Up</Button>
        </Nav>
    );
}

const Navigation = (props) => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Internet Scavenger Hunt</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='me-auto'>
                        <Nav.Link href="#home">Explore</Nav.Link>
                        <Nav.Link href="#link">Create</Nav.Link>
                    </Nav>
                    <LoginOptions loggedIn={props.loggedIn}></LoginOptions>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

module.exports = Navigation;