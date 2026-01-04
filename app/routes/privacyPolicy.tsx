import { MoveLeft } from "lucide-react";
import { NavLink, useSearchParams, type MetaFunction } from "react-router";

const interfaceTranslations = {
  back: {
    ru: "Назад",
    ee: "Tagasi",
  },
  privacyPolicy: {
    ru: "Политика конфиденциальности:",
    ee: "Privaatsuspoliitika:",
  },
};
const translations = [
  {
    title: {
      ru: "1. Общая информация",
      ee: "1. Üldine teave",
    },
    content: {
      ru: "Данный веб-сайт уважает вашу конфиденциальность и обрабатывает персональные данные в соответствии с применимым законодательством о защите данных, включая Общий регламент по защите данных (GDPR). Отправляя форму на этом сайте, вы соглашаетесь с обработкой ваших персональных данных в соответствии с условиями, изложенными ниже.",
      ee: "Käesolev veebisait austab teie privaatsust ja töötleb isikuandmeid vastavalt kehtivatele andmekaitsealastele õigusaktidele, sealhulgas isikuandmete kaitse üldmäärusele (GDPR). Vormide esitamisega sellel veebisaidil nõustute oma isikuandmete töötlemisega allpool kirjeldatud tingimustel.",
    },
  },

  {
    title: {
      ru: "2. Какие данные мы собираем",
      ee: "2. Milliseid andmeid me kogume",
    },
    content: {
      ru: "При отправке формы на сайте мы можем собирать следующие персональные данные:\n\n• Адрес электронной почты (обязательно)\n• Номер телефона (необязательно, по желанию пользователя)\n• Содержание сообщения (если применимо)\n\nМы не собираем чувствительные персональные данные.",
      ee: "Veebisaidi vormide esitamisel võime koguda järgmisi isikuandmeid:\n\n• E-posti aadress (kohustuslik)\n• Telefoninumber (valikuline, kasutaja soovil)\n• Sõnumi sisu (vajaduse korral)\n\nMe ei kogu tundlikke isikuandmeid.",
    },
  },

  {
    title: {
      ru: "3. Цели обработки данных",
      ee: "3. Andmete töötlemise eesmärk",
    },
    content: {
      ru: "Персональные данные обрабатываются исключительно для следующих целей:\n\n• Связь с вами по поводу вашего запроса\n• Предоставление информации о запрошенных услугах\n• Ответ на ваше сообщение\n\nВаши данные не используются для маркетинга, рассылок или автоматизированного профилирования.",
      ee: "Isikuandmeid töödeldakse üksnes järgmistel eesmärkidel:\n\n• Teiega ühenduse võtmiseks seoses teie päringuga\n• Teabe edastamiseks soovitud teenuste kohta\n• Teie sõnumile vastamiseks\n\nTeie andmeid ei kasutata turunduseks, uudiskirjadeks ega automatiseeritud profiilianalüüsiks.",
    },
  },

  {
    title: {
      ru: "4. Правовое основание обработки",
      ee: "4. Andmete töötlemise õiguslik alus",
    },
    content: {
      ru: "Обработка персональных данных осуществляется на основании:\n\n• Вашего согласия, выраженного добровольной отправкой формы\n• Законного интереса — для ответа на ваш запрос\n\nВы можете отозвать свое согласие в любое время, связавшись с нами.",
      ee: "Isikuandmete töötlemine toimub järgmistel alustel:\n\n• Teie nõusolek, mis on antud vabatahtlikult vormi esitamisega\n• Õigustatud huvi – teie päringule vastamiseks\n\nTeil on õigus oma nõusolek igal ajal tagasi võtta, võttes meiega ühendust.",
    },
  },

  {
    title: {
      ru: "5. Хранение и защита данных",
      ee: "5. Andmete säilitamine ja turvalisus",
    },
    content: {
      ru: "Персональные данные хранятся в защищенной среде и принимаются меры для предотвращения несанкционированного доступа.\n\nДанные могут храниться и обрабатываться с использованием сторонних инфраструктурных сервисов (например, MongoDB Atlas), расположенных в пределах или за пределами Европейского Союза, при соблюдении требований GDPR.\n\nМы не продаем и не передаем ваши данные третьим лицам, за исключением случаев, предусмотренных законом.",
      ee: "Isikuandmeid hoitakse turvalises keskkonnas ning rakendatakse meetmeid volitamata juurdepääsu vältimiseks.\n\nAndmeid võidakse säilitada ja töödelda kolmandate osapoolte infrastruktuuriteenuste abil (näiteks MongoDB Atlas), mis võivad asuda Euroopa Liidus või väljaspool seda, järgides GDPR-i nõudeid.\n\nMe ei müü ega edasta teie isikuandmeid kolmandatele isikutele, välja arvatud seadusest tulenevatel juhtudel.",
    },
  },

  {
    title: {
      ru: "6. Срок хранения данных",
      ee: "6. Andmete säilitamise aeg",
    },
    content: {
      ru: "Персональные данные хранятся только в течение времени, необходимого для достижения целей, для которых они были собраны, либо в соответствии с требованиями законодательства.",
      ee: "Isikuandmeid säilitatakse ainult seni, kuni see on vajalik nende kogumise eesmärkide täitmiseks või vastavalt seadusest tulenevatele nõuetele.",
    },
  },

  {
    title: {
      ru: "7. Права пользователя",
      ee: "7. Kasutaja õigused",
    },
    content: {
      ru: "Вы имеете право:\n\n• Запросить доступ к вашим персональным данным\n• Запросить исправление или удаление данных\n• Отозвать свое согласие в любое время\n• Ограничить обработку данных\n\nДля реализации этих прав вы можете связаться с нами, используя контактные данные, указанные на сайте.",
      ee: "Teil on õigus:\n\n• Taotleda juurdepääsu oma isikuandmetele\n• Nõuda andmete parandamist või kustutamist\n• Võtta oma nõusolek igal ajal tagasi\n• Piirata andmete töötlemist\n\nNende õiguste kasutamiseks võtke meiega ühendust veebisaidil toodud kontaktandmete kaudu.",
    },
  },

  {
    title: {
      ru: "8. Контактная информация",
      ee: "8. Kontaktandmed",
    },
    content: {
      ru: "Если у вас есть вопросы относительно данной Политики конфиденциальности или обработки ваших данных, пожалуйста, свяжитесь с нами через контактную информацию, размещенную на сайте.",
      ee: "Kui teil on küsimusi käesoleva privaatsuspoliitika või teie isikuandmete töötlemise kohta, võtke meiega ühendust veebisaidil toodud kontaktandmete kaudu.",
    },
  },

  {
    title: {
      ru: "9. Изменения в Политике",
      ee: "9. Privaatsuspoliitika muudatused",
    },
    content: {
      ru: "Настоящая Политика конфиденциальности может обновляться. Все изменения будут публиковаться на данной странице.",
      ee: "Käesolevat privaatsuspoliitikat võidakse aeg-ajalt uuendada. Kõik muudatused avaldatakse sellel lehel.",
    },
  },
  {
    content: {
      ru: "Отправляя форму, вы соглашаетесь с обработкой ваших персональных данных в соответствии с Политикой конфиденциальности.",
      ee: "Vormi esitamisega nõustute oma isikuandmete töötlemisega vastavalt privaatsuspoliitikale.",
    },
  },
];

export const meta: MetaFunction = ({ location }) => {
  const sp = new URLSearchParams(location.search);
  const rawLang = sp.get("lang") ?? "ee";
  const lang: "ee" | "ru" = rawLang === "ru" ? "ru" : "ee";

  const canonical = `https://abik.ee${location.pathname}?lang=${lang}`;

  const title =
    lang === "ru"
      ? "Политика конфиденциальности | Abik"
      : "Privaatsuspoliitika | Abik";

  const description =
    lang === "ru"
      ? "Информация о том, как Abik собирает, использует и защищает персональные данные."
      : "Teave selle kohta, kuidas Abik kogub, kasutab ja kaitseb isikuandmeid.";

  return [
    { title },
    { name: "description", content: description },

    // canonical
    { rel: "canonical", href: canonical },

    // hreflang
    {
      rel: "alternate",
      hrefLang: "et",
      href: `https://abik.ee${location.pathname}?lang=ee`,
    },
    {
      rel: "alternate",
      hrefLang: "ru",
      href: `https://abik.ee${location.pathname}?lang=ru`,
    },
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: `https://abik.ee${location.pathname}?lang=ee`,
    },
  ];
};

const PrivacyPolicy = () => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as "ee" | "ru";

  return (
    <div className="flex-1 py-5 px-5">
      {/* Nav back button */}
      <NavLink
        className="flex w-6/12 md:w-2/12 lg:w-1/12 justify-start items-center gap-x-2 cursor-pointer btn btn-primary"
        to={{
          pathname: "/",
          search: searchParams.toString(),
        }}
      >
        <MoveLeft />
        {interfaceTranslations.back[lang]}
      </NavLink>

      {/* Content */}
      <h1 className="font-bold text-2xl mt-10">
        {interfaceTranslations.privacyPolicy[lang]}
      </h1>
      {translations.map((item, i) => (
        <div key={i} className="mt-10">
          {item.title ? (
            <h2 className="font-bold text-xl">{item.title[lang]}</h2>
          ) : null}
          <p className="mt-2 whitespace-pre-wrap">{item.content[lang]}</p>
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicy;
