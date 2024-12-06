const React = require('react');
const Nav = require('react-bootstrap/Nav');
const Navbar = require('react-bootstrap/Navbar');
const Container = require('react-bootstrap/Container');

const LoginOptions = (props) => {
    if(props.loggedIn) {
        return (
            <Nav className='justify-content-end'>
                <Nav.Link href='/changePass'>Change Password</Nav.Link>
                <Nav.Link href='/logout'>Logout</Nav.Link>
            </Nav>
        );
    }

    return (
        <Nav className='justify-content-end'>
            <Nav.Link href='/login'>Login</Nav.Link>
        </Nav>
    );
}

const Navigation = (props) => {
    return (
        <Navbar expand='lg'>
            <Container>
                <Navbar.Brand href='#home'>React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse>
                    <Nav className='me-auto'>
                        <Nav.Link href='/explore'>Explore</Nav.Link>
                        <Nav.Link href='/maker'>Create</Nav.Link>
                    </Nav>
                    <LoginOptions loggedIn={props.loggedIn} premium={props.premium}/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

module.exports = Navigation;