import axios from 'axios'

export default axios.create({
	baseURL: 'https://react-quiz-8f0d1.firebaseio.com/'
})