interface Person {
    firstName: string;
    lastName: string;
}
function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

const HomeView: React.FC = () => {

    let user = { firstName: "Jane", lastName: "User" };

    document.body.textContent = greeter(user);

    return <div></div>
};

export default HomeView;
