export class Node {
  data : any;
  next : Node | null;
  prev : Node | null;
  constructor(data : any) {
      this.data = data;
      this.next = null;
      this.prev = null;
  }
}

export class LinkedList {
  head : Node | null;
  tail : Node | null;
  size : number;
  constructor() {
      this.head = null;
      this.tail = null;
      this.size = 0;
  }

  // add a data to the end of the list (TAIL)
  append(data : any) : void {
      const newNode : Node = new Node(data);
      if (this.tail) {
          this.tail.next = newNode;
          newNode.prev = this.tail;
          this.tail = newNode;
      } else {
          this.head = newNode;
          this.tail = newNode;
      }
      this.size ++;
  }

  // add data to the start of the list (HEAD)
  prepend(data : any) : void {
      const newNode : Node = new Node(data);
      if (this.head) {
          this.head.prev = newNode;
          newNode.next = this.head;
          this.head = newNode;
      } else {
          this.head = newNode;
          this.tail = newNode;
      }
      this.size ++;
  }

  // insert data at a specific position
  insertAt(data : any, position : number) : void {
      if (position < 0 || position > this.size - 1) {
          throw Error('Position ' + position + ' is not in the list');
      }
      if (position == 0) {
          this.prepend(data);
          return;
      }
      if (position == this.size) {
          this.append(data);
          return;
      }
      let currentNode : Node = this.head as Node;
      let index : number = 0;
      while (index < position) {
          currentNode = currentNode.next as Node;
          index ++;
      }
      const newNode : Node = new Node(data);
      newNode.next = currentNode;
      newNode.prev = currentNode.prev;
      (currentNode.prev as Node).next = newNode;
      currentNode.prev = newNode;
      this.size ++;
  }

  // remove a node at a specific position ad return its data
  removeAt(position : number) : any {
      if (position < 0 || position > this.size - 1) {
          throw Error('Position ' + position + ' is not in the list');
      }
      if (position == 0) {
          return this.removeHead();
      }
      if (position == this.size - 1) {
          return this.removeTail();
      } 
      let current : Node = this.head as Node;
      let index : number = 0;
      while (index < position) {
          current = current.next as Node;
          index ++;
      }
      (current.prev as Node).next = current.next;
      (current.next as Node).prev = current.prev;
      this.size --;
      return current.data;
  }

  // return node data at a specific position
  getAt(position : number) : any {
      if (position < 0 || position >= this.size) {
          throw Error('Position ' + position + ' is not in the list');
      }
      let current = this.head;
      let index = 0;
      while (index < position) {
          current = (current as Node).next;
          index ++;
      }
      return (current as Node).data;
  }

  // return head data
  getHead() : any {
      if (this.size == 0) {
          throw Error('No head in an empty list');
      }
      return (this.head as Node).data;
  }

  // return tail data
  getTail() : any {
      if (this.size == 0) {
          throw Error('No tail in an empty list');
      }
      return (this.tail as Node).data;
  }

  // remove list head and return its data
  removeHead() : any {
      if (this.size == 0) {
          throw Error('No head in an empty list');
      }
      const data : any = (this.head as Node).data; 
      this.head = (this.head as Node).next;
      if (this.head) {
          this.head.prev = null;
      } else {
          this.tail = null;
      }
      this.size --; 
      return data;  
  }

  // remove list tail and return its data
  removeTail() : any {
      if (this.size == 0) {
          throw Error('No tail in an empty list');
      }
      const data : any = (this.tail as Node).data; 
      this.tail = (this.tail as Node).prev;
      if (this.tail) {
          this.tail.next = null;
      } else {
          this.head = null;
      }
      this.size --;
      return data;
  }

  // forEach method to apply a callback function to each element
  forEach(callback : (value : any, index : number) => void) : void {
      let current : Node | null = this.head;
      let index : number = 0;
      while (current !== null) {
          callback(current.data, index);
          current = current.next;
          index ++;
      }
  }

  // print list content in the console
  log() : void {
      if (this.size == 0) {
          console.log('Empty list');
          return;
      }
      let current : Node = this.head as Node;
      let result : any[] = [];
      for (let i : number = 0; i < this.size; i ++) {
          result.push(current.data);
          if (current.next) {
              current = current.next;
          }
      }
      console.log(result.join(' <-> '));
  }
}
