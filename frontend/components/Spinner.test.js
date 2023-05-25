// Import the Spinner component into this file and test
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Spinner from './Spinner';
// that it renders what it should for the different props it can take.
test('sanity', () => {
  render (<Spinner on={true} />)
  const text = screen.queryByText("Please wait...")
  expect(text).toBeInTheDocument();
})
