import React from 'react'
import 'bulma'
import axios from 'axios'
import IngredientsCard from './IngredientsCard'
import Auth from '../../lib/Auth'
import _ from 'lodash'
import Flash from '../../lib/Flash'

class IngredientsIndex extends React.Component {
  constructor() {
    super()

    this.state = {
      choices: []
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    axios.get('/api/ingredients')
      .then(res => this.setState({ ingredients: res.data }))

    axios.get('/api/recipes',
      {headers: { Authorization: `Bearer ${Auth.getToken()}` }})
      .then(res => this.setState({ recipes: res.data }))
  }

  handleClick(e){
    let choices
    if(this.state.choices.length < 2) {
      choices = [...this.state.choices, parseInt(e.target.id)]
      this.setState({ choices })
    }
    console.log('CHOICE', this.state.choices)
    console.log('STATE', this.state)
    console.log('IDs', e.target.id)
  }

  handleSubmit(){
    const resultRecipes = this.state.recipes.filter(recipe => {
      const ingredientIds = recipe.ingredients.map(ingredient => ingredient.id)
      return _.intersection(ingredientIds, this.state.choices).length === 2
    })
    if (resultRecipes.length < 1){
      console.log('NOT FOUND')
      this.props.history.push('/ingredients')
      Flash.setMessage('white', 'Sorry there is no recipe for that combination of ingredients')
      this.setState( { choices: []})
    } else this.props.history.push(`/recipes/${resultRecipes[0].id}`)
  }

  render(){
    console.log(this.state, 'STATE HERE')
    if(!this.state.ingredients) return <h1>Loading...</h1>
    console.log(this.state.ingredients)
    return(
      <div>
        <section className="hero is-success is-small">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Select two ingredients:
              </h1>
              <h2 className="subtitle">
                1 that <strong>your child</strong> likes to eat & 1 that <strong>you</strong> would like your child to eat
              </h2>
            </div>
          </div>
        </section>
        <div className="columns is-multiline">
          {this.state.ingredients.map(ingredient =>
            <div className="column is-one-quarter" key={ingredient.id}>
              <button onClick={this.handleClick}
                className={`
                  ingredientBtn
                  ${this.state.choices.includes(parseInt(ingredient.id)) ? 'selected':ingredient.id}`}>
                <IngredientsCard {...ingredient} />
              </button>
            </div>
          )}
        </div>
        <button className="button submitingbtn is-fullwidth is-success" onClick={this.handleSubmit}>Submit</button>
      </div>
    )
  }
}

export default IngredientsIndex
