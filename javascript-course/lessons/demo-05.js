// Demo 05: Objetos

const user = { id: 1, nome: 'Ana', ativo: true }
console.log(user.nome)

const { id, nome } = user
const ativo = true
const u2 = { id, nome, ativo }
console.log(u2)

const conta = {
  saldo: 100,
  depositar(valor) { this.saldo += valor }
}
conta.depositar(50)
console.log('saldo', conta.saldo)

const a = { x: 1 }
const b = a
const c = { ...a }
console.log('ref', b === a, 'copy', c === a)
