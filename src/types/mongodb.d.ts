interface Users {
  name: string
  email: string
  image: string
  id: string
}

interface Room {
  id : string,
  roomId : string
  messages : Message[]
  members : string[]
}

interface Message {
  id : string,
  text : string,
  sender : string,
  timestamp : number
}