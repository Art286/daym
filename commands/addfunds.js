module.exports = {
  name: "addfunds",
  description: "Provides dhinospanel shop payment instructions",
  nashPrefix: false,
  role: "user",
  execute: (api, event, args, prefix) => {
    const responseMessage = `welcome to dhinospanel shop ⭑.ᐟ

gcash mode of payment only
gcn : 09929805730 
initial : J.G.

ᯓ★ sign up - https://dhinospanel.shop/
ᯓ★ explore site to avoid asking common questions.
ᯓ★ 10 pesos minimum for adding funds

─── ⋆⋅ rules & regulations ⋅⋆ ───
ᯓ★ strictly no refund once funds are added.
ᯓ★ always try low quantity to avoid delay orders.
ᯓ★ always mag pa ayos ng link
ᯓ★ wrong link no refund.
ᯓ★ no to same link hintayin mag complete status.
ᯓ★ sa pag a-add funds, send screenshot of your reciept together with your profile. very strict sa ganto kasi uso ang edited and fake reciept.


RECOMMEND 
https://www.facebook.com/61559187959668/posts/122184739646306265/`;

    api.sendMessage(responseMessage, event.threadID);
  },
};