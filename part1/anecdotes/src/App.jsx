import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0);

  const [votes, setVotes] = useState({});

  const [mostVoted, ] = Object.entries(votes).reduce((acc, [index, value]) => (value > acc[1]) ? [index, value] : acc, [null, -Infinity]);

  console.log(mostVoted);

  const vote = () => {
    if (!votes[selected]) return setVotes({...votes, [selected]: 1});
    setVotes({...votes, [selected]: votes[selected] + 1});
  }

  const nextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {!votes[selected] ? 0 : votes[selected]}</p>
      <button onClick={vote}>Vote</button>
      <button onClick={nextAnecdote}>Next Anecdote</button>
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[mostVoted]}</p>
    </div>
  )
}

export default App