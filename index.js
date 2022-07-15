
class TodoList{
    #baseUrl = "http://localhost:4232/";
    #endUrl = "todos/";
    #storedData = {};
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
    updateData = async () => {
        this.storedData = await this.retrieveApiData();
    }
    init = () => {
        const ulElement = document.querySelector("ul");
        const inputBar = document.querySelector("input");
        inputBar.addEventListener("keyup", event => {
            if(event.key === "Enter" && event.target.value.trim() !== ""){
                const content = event.target.value;
                this.postItem(content);
                inputBar.value = "";
                }
            });
        ulElement.addEventListener("click", event => {
            if(event.target.className == "delete-button" && this.storedData[event.target.id]){
                this.deleteItem(event.target.id);
            }
        });
    }
    postItem = async (item) => {
        await fetch(this.#baseUrl + this.#endUrl, {
            method: 'POST',
            body: JSON.stringify({
                title: item,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        await this.updateData();
        const ulElement = document.querySelector("ul");
        ulElement.scrollTop = ulElement.scrollHeight;

    }
    deleteItem = async (id) => {
        await fetch(this.#baseUrl + this.#endUrl + id, {
            method: 'DELETE',
        });
        // update the data to keep it synced with the server
        await this.updateData();
    }
    retrieveApiData = async () => {
        const data = await fetch(this.#baseUrl + this.#endUrl)
            .then(response => response.json());
        const makeBetterData = {};
        for(let item of data){
            if(!makeBetterData[item.id]){
                makeBetterData[item.id] = item;
            }
        }
        return makeBetterData;
    }
    renderItemList = () => {
        const ulElement = document.querySelector("ul");
        ulElement.innerHTML = "";
        for(let item in this.storedData){
            const itemElement = document.createElement("li");
            const itemId = this.storedData[item].id;
            const itemTitle = this.storedData[item].title;
            const textElement = document.createElement("p");
            textElement.innerText = `${itemId}. ${itemTitle}`;
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.innerText = "X";
            deleteButton.id = itemId;
            itemElement.append(textElement);
            itemElement.append(deleteButton);
            ulElement.append(itemElement);
        }
        console.log("finished rendering.")
    }
    run = async () => {
        await this.updateData();
    }

}

const myApp = new TodoList();
myApp.run();