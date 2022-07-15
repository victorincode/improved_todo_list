
class TodoList{
    // #baseUrl = "https://jsonplaceholder.typicode.com/";
    #baseUrl = "http://localhost:4232/";
    #endUrl = "todos/";
    #storedData = [];
    constructor(){
        this.init();
    }
    set storedData(newData){
        this.#storedData = newData;
        console.log("set new data");
        this.renderItemList();
    }
    get storedData(){
        return this.#storedData;
    }
    init = () => {
        const ulElement = document.querySelector("ul");
        ulElement.addEventListener("click", event => {
            if(event.target.className == "delete-button" && this.storedData[event.target.id]){
                console.log("remove this id: ", event.target.id);
                this.deleteItem(event.target.id);
            }
        });
    }
    deleteItem = async (id) => {
        await fetch(this.#baseUrl + this.#endUrl + id, {
            method: 'DELETE',
        });
        // this.storedData = this.storedData.filter(
        //     data => +data.id !== id
        // );
        this.storedData = await this.retrieveApiData();

    }
    retrieveApiData = async () => {
        const data = await fetch(this.#baseUrl + this.#endUrl)
        .then(response => response.json());
        return data;
    }
    renderItemList = async() => {
        const ulElement = document.querySelector("ul");
        ulElement.innerHTML = "";
        for(let item of this.storedData){
            const itemElement = document.createElement("li");
            itemElement.innerText = `${item.id}. ${item.title}`;
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.innerText = "X";
            deleteButton.id = item.id;
            itemElement.append(deleteButton);
            ulElement.append(itemElement);
        }
        console.log("completed render.");
    }
    run = async () => {
        this.storedData = await this.retrieveApiData();
    }

}

const myApp = new TodoList();
myApp.run();