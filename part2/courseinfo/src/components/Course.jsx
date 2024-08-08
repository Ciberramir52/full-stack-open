const Header = (props) => {
    return (
        <h2>{props.course}</h2>
    )
}

const Part = (props) => {
    return (
        <p>{props.part} {props.exercises}</p>
    )
}

const Content = (props) => {
    return (
        <div>
            {
                props.parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} />)
            }
        </div>
    )
}

const Total = (props) => {
    const total = props.parts.reduce((accumulator, part) => accumulator + part.exercises, 0);
    return (
        <h4>Number of exercises {total}</h4>
    )
}

const Course = (props) => {
    const { course } = props;
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course;