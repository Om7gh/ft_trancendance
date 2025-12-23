import Card from '../types/UserCard'

function cardsFilterByQuery(query: string, cards: Card[]){
  return (cards.filter(card => {
    let tmpName = card.friend.name;
    return (tmpName.toLowerCase().includes(query.toLowerCase()))
  }))
}

export {cardsFilterByQuery};