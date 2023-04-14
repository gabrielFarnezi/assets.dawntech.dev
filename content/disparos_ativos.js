import { BlipService, WhatsAppBlipService } from '@dawntech/dwntbots-services';

const BOT_URL = "https://consorcioembracon.http.msging.net/";
const BOT_KEY = "";

(async () => {

    const wa = WhatsAppBlipService.withHttp(BOT_URL, BOT_KEY);
    const blip = BlipService.withHttp(BOT_URL, BOT_KEY);

    // Busca a ID do contato para este bot
    // A ID tem o formato DDI + Telefone + '@wa.gw.msging.net'
    const identity = await wa.getContactIdentityFromPhoneNumber('telefone_com_ddd_somente_digitos'); //'@wa.gw.msging.net'
    console.log(identity)

    // Cria (ou atualiza) um contato/usuário dentro do Blip
    await blip.updateContact(
        {
            "identity": identity, // ID retornada pela função acima, obrigatório
            "name": "NomeDoUsuario",
            "phoneNumber": identity.replace('@wa.gw.msging.net', ''),
            "taxDocument": "cpfUsuario",
            "email": "teste@bot.com",
            "city": "Cidade",
            "extras": {
                "team": "email_atendente@cnvw.com.br",
                "zipCode": "cep"
            },
            "source": "WhatsApp"
        },
        "set" // set/merge, obrigatório
    )

    // Posiciona o usuário com esta ID no bot 'devcnvwath' (bot de atendimento humano do CNVW)
    let changeUserToBot = await blip.changeContactBot(identity, 'devcnvwath@msging.net')
    console.log(changeUserToBot)

    // Posiciona o usuário, dentro do bot definido acima, no bloco 'Mensagem ativa do Zoho'
    let destinationBotState = await blip.changeContactBotState(identity, '3e854d4d-80ec-46fd-b43a-17072675ddab', '6b920e71-1ad6-4ac1-812b-0cca81c5727d')
    console.log(destinationBotState)

    // Posiciona o usuário no bloco de início do bot principal
    let mainBotOnboarding = await blip.changeContactBotState(identity, 'ce2311e0-aca5-4a99-9b5d-66380c0b145d', 'onboarding')
    console.log(mainBotOnboarding)

    // Posiciona o usuário, dentro do bot definido acima, no bloco 'Mensagem ativa do Zoho'
    let sendMessage = await wa.sendMessageTemplate(identity, 'cnvw_envioativo_1', [])
    console.log(sendMessage)
})()
