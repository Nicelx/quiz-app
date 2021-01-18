import axios from '../../axios/axios-quiz'
import { 
	FETCH_QUIZES_START, 
	FETCH_QUIZES_SUCCESS, 
	FETCH_QUIZES_ERROR, 
	FETCH_QUIZ_SUCCESS, 
	QUIZ_SET_STATE,
	FINISH_QUIZ,
	QUIZ_NEXT_QUESTION,
	QUIZ_RETRY
} from './actionTypes'

export function fetchQuizes() {
	return async (dispatch, getState) => {
		dispatch(fetchQuizesStart())
		try{
			const response = await axios.get('/quizes.json')
			const quizes = []
			console.log(response.data)
			Object.keys(response.data).forEach((key, index) => {
				console.log('this ',key)			
				quizes.push({
					id: key,
					name: response.data[key][0].testName ||	`test №${index + 1}`				
					// name: `test №${index + 1}`
				})
			})
			dispatch(fetchQuizesSuccess(quizes))
		}
		catch(e) {
			dispatch(fetchQuizesError(e))
		}
	}
}

export function fetchQuizById(quizId) {
	return async dispatch => {
		dispatch(fetchQuizesStart())

		try{
			const response = await axios.get(`quizes/${quizId}.json`)
			const quiz = response.data
			
			dispatch(fetchQuizSuccess(quiz))
		} catch(e) {
			dispatch(fetchQuizesError(e))
		}
	}
}

export function fetchQuizSuccess(quiz) {
	return {
		type: FETCH_QUIZ_SUCCESS,
		quiz
	}
}

export function fetchQuizesStart() {
	return {
		type: FETCH_QUIZES_START
	}
}

export function fetchQuizesSuccess(quizes) {
	return {
		type: FETCH_QUIZES_SUCCESS,
		quizes
	}
}

export function fetchQuizesError(e) {
	return {
		type: FETCH_QUIZES_ERROR,
		error: e
	}
}

export function quizSetState(answerState, results) {
	return {
		type: QUIZ_SET_STATE,
		answerState, results
	}
	
}

export function finishQuiz() {
	return {
		type: FINISH_QUIZ
	}
}

export function quizNextQuestion(number) {
	return {
		type: QUIZ_NEXT_QUESTION,
		number
	}
}

export function retryQuiz() {
	return {
		type: QUIZ_RETRY
	}
}
export function quizAnswerClick(answerId) {
	return (dispatch, getState) => {
		const state = getState().quiz
		console.log(' 11 ',getState());
		if (state.answerState) {
			const key = Object.keys(state.answerState)[0]
			if (state.answerState[key] === 'success') {
				return
			}
		}
		const question = state.quiz[state.activeQuestion]
		const results = state.results
		
		const timeout = window.setTimeout(() => {
			if (isQuizFinished(state)) {
				dispatch(finishQuiz())
			} else {
				dispatch(quizNextQuestion(state.activeQuestion + 1))
			}

			window.clearTimeout(timeout)
		}, 350)	


		if (question.rightAnswerId === answerId) {
			if (!results[question.id]) {
				results[question.id] = 'success'
			}
			
			dispatch(quizSetState({[answerId]: 'success'}, results))
			// this.setState({
			// 	answerState: {[answerId]: 'success'},
			// 	results: results
			// })

			// дефолтный блок чтобы красное не переключало вопрос
			// const timeout = window.setTimeout(() => {
			// 	if (this.isQuizFinished()) {
			// 		this.setState({
			// 			isFinished: true
			// 		})
			// 	} else {
			// 		this.setState({
			// 			activeQuestion: this.state.activeQuestion + 1,
			// 			answerState: null
			// 		})
			// 	}

			// 	window.clearTimeout(timeout)
			// }, 500)			
		}
		else {						
			results[question.id] = 'error'
			dispatch(quizSetState({[answerId]: 'error'}, results))
		}	
	}
} 

function isQuizFinished(state) {
	return state.activeQuestion + 1 === state.quiz.length
}