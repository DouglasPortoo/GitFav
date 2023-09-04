export class GithubUser {
  static async search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    const data = await fetch(endpoint)
    const data_2 = await data.json()
    const { login, name, public_repos, followers } = data_2
    return {
      login: login,
      name: name,
      public_repos: public_repos,
      followers: followers
    }
  }
}

//classe que recebe e fornece os dados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@Github-fav')) || []

  }

  save() {
    localStorage.setItem('@Github-fav', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('usuario já cadastrado')
      }

      const response = await GithubUser.search(username)

      if (response.login === undefined) {
        throw new Error('Usuario nao encontrado')
      }

      this.entries = [response, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    this.entries = this.entries.filter(filter => filter.login !== user.login)
    this.update()
    this.update()
    this.save()
  }
}

//classe que monta o HTML e faz as funcionalidades
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = document.querySelector('.search button')
    addButton.onclick = () => {
      const value = document.querySelector('.search input').value
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    if (this.entries.length > 0) {
      document.querySelector("#vaziu").classList = 'sumiu'
    } else {
      document.querySelector("#vaziu").classList.remove('sumiu')
    }

    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `imagem do ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a').target = `_blank`
      row.querySelector('.user p').textContent = `${user.name}`
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = `${user.public_repos}`
      row.querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar?")

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })

  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = ` 
    <td class="user">
      <img src= alt=>
 
      <a href= target="_blank">
        <p></p>
        <span></span>
      </a>
    </td>
    <td class="repositories"></td>
    <td class="followers"></td>
    <td>
      <button class="remove">Remover</button>
    </td>
  `
    return tr
  }

  removeAllTr() {

    const trs = this.tbody.querySelectorAll('tr')

    trs.forEach(tr => tr.remove())

  }
}