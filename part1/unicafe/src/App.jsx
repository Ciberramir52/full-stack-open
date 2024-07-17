import { useState } from 'react';

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad, all, average, positive }) => {

  return (
    <>
      {
        (all === 0)
          ? <p>No feedback given</p>
          : <>
            <h2>Statistics</h2>
            <table>
              <tbody>
                <StatisticLine text='Good' value={good} />
                <StatisticLine text='Neutral' value={neutral} />
                <StatisticLine text='Bad' value={bad} />
                <StatisticLine text='All' value={all} />
                <StatisticLine text='Average' value={average} />
                <StatisticLine text='Positive' value={positive} />
              </tbody>
            </table>
          </>
      }
    </>
  )
}

const Button = ({ text, handleClick }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + bad + neutral;

  const score = good + (bad * -1);
  const average = score / all;
  const positive = good / all * 100;

  const statistics = { good, neutral, bad, all, average, positive };
  console.log(statistics);

  const handleOption = (option, setOption) => () => {
    setOption(option + 1);
  }

  return (
    <>
      <h1>Give feedback</h1>
      <Button handleClick={handleOption(good, setGood)} text='Good' />
      <Button handleClick={handleOption(neutral, setNeutral)} text='Neutral' />
      <Button handleClick={handleOption(bad, setBad)} text='Bad' />
      <Statistics {...statistics} />
    </>
  )
}

export default App
