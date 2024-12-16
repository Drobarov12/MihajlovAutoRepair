# React wirh Matirial UI

## Структура на проектот
```bash
- public
    assets
- src
    components
    context
    locales
    pages
    services
    index.js
    theme.js
```

Проектот е организиран во неколку клучни директориуми и датотеки кои придонесуваат за целокупната функционалност на апликацијата:

#### **src**
Главниот директориум на проектот, кој го содржи основниот код за апликацијата. Влезната точка на апликацијата се наоѓа во датотеката **index.js**, која е одговорна за рендерирање на root компонентата и иницијализирање на апликацијата.

#### **pages**
Оваа папка ги содржи сите страници во апликацијата. Страниците се организирани во посебни папки за групирани страници, за поедноставни страници лоцирани директно во овој директориум.

#### **components**
Директориумот **components** ги чува елементите и компонентите на корисничкиот интерфејс за повеќекратна употреба кои помагаат да се рационализира корисничкото искуство. Овие компоненти се дизајнирани да се користат во различни делови на апликацијата, промовирајќи конзистентност и намалувајќи го повторување на кодот.

#### **services**
Директориумот **services** е местото каде што се управуваат надворешните комуникациски услуги. Во моментов, главната услуга **api.js**, која делува како мост за комуникација помеѓу апликацијата React и API.


## Креирањe прозорец за потврда за повеќекратна употреба во React со користење на Material-UI

### Преглед

Во современите веб-апликации, вообичаено е да се поттикнуваат корисниците со дијалози за потврда пред да се извршат критични дејства, како што се бришење, поднесување неповратни формулари или потврдување значајни промени на состојбата. Ова осигурува дека корисниците имаат можност да ги потврдат своите намери пред да активираат дејство. React, во комбинација со Material-UI, обезбедува едноставен и моќен начин за создавање повеќекратни и конзистентни елементи на интерфејсот, како што се дијалозите за потврда. 

---

### Зошто ви е потребен дијалог за потврда за повеќекратна употреба

Дијалогот за потврда е суштинска компонента на интерфејсот што ја подобрува конзистентноста и на корисничкото искуство (UX) и на корисничкиот интерфејс (UI). Еве неколку причини зошто е корисно да се имплементира дијалог за потврда за повеќекратна употреба во вашата апликација:

#### 1. **Конзистентност низ апликацијата**
 - Дијалогот за потврда треба да се однесува постојано низ целата апликација. Корисниците треба да го видат истиот дизајн, чувство и функционалност без разлика дали потврдуваат бришење на запис, се одјавуваат од апликацијата или прифаќаат важна акција. Со создавање на компонента за дијалог за потврда за повеќекратна употреба, гарантирате дека дијалогот се однесува на ист начин во секој случај, правејќи ја вашата апликација покохезивна и попријатна за корисникот.

#### 2. **Подобро корисничко искуство**
 - Без дијалози за потврда, корисниците може случајно да извршат деструктивни или неповратни дејства, како што се бришење важни податоци или неправилно поднесување формулар. Дијалогот за потврда бара валидација од корисникот пред да продолжите со таквите дејства, намалувајќи ја веројатноста за грешки и зголемувајќи ја целокупната доверба што корисниците ја имаат во интеракцијата со вашата апликација.

#### 3. **Централизирана логика**
 - Со креирање на дијалог за потврда за повеќекратна употреба и глобално управување со неговата состојба, избегнувате дуплирање на кодот. Ова ја намалува веројатноста за воведување грешки поради недоследности или пропуштена логика при рачно спроведување на дијалозите за потврда на секоја страница. Централизирањето на оваа логика исто така го прави кодот полесен за одржување и менување. На пример, ако треба да го ажурирате изгледот или однесувањето на дијалогот за потврда, тоа треба да го направите само на едно место.

#### 4. **Подобрена читливост и одржување на кодот**
 - Повторната употреба на дијалогот за потврда на страниците и компонентите ја поедноставува вашата база на кодови. Наместо да пишувате посебни модални имплементации на различни страници, вие го централизирате дијалогот во една компонента и во контекст на React. Овој пристап е многу почист и полесен за отстранување грешки или проширување.

---

### Чекор-по-чекор објаснување

Ајде да разбереме како создаваме дијалог за потврда за повеќекратна употреба во React и го интегрираме низ апликацијата.

#### Чекор 1: Креирајте ја компонентата за дијалог за потврда

Почнуваме со создавање поставување едноставна компонента за дијалог за потврда која ќе прифати реквизити како „отвори“ (дали дијалогот е видлив), „наслов“ (наслов на дијалогот), „порака“ (пораката што треба да се прикаже) и две функции: „onClose“ ` (за справување со затворање на дијалогот) и „onConfirm“ (за справување со дејството кога корисникот ќе потврди).

```jsx
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => { onConfirm(); onClose(false); }} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
```

**Објаснување на компонентите:**
- `Dialog`: Ова е контејнер за дијалогот за потврда, прикажувајќи го модалното преклопување.
- `DialogTitle`: Наслов на дијалогот (на пр., „Избриши ставка“).
- `DialogContent`: Телото на дијалогот, кое ја содржи пораката (на пр., „Дали сте сигурни дека сакате да ја избришете оваа ставка?“).
- `DialogActions`: Ги содржи копчињата за корисникот да го откаже или потврди дејството.

Оваа компонента за дијалог е едноставна, но доволно флексибилна за повторно да се користи насекаде во апликацијата.

---

#### Чекор 2: Создадете контекст за управување со состојбата на дијалогот за потврда

Наместо локално да управуваме со состојбата на дијалогот за потврда на секоја страница или компонента, ние користиме React Context за да обезбедиме глобално решение за управување со состојбата. Ова ни овозможува да го активираме дијалогот од кој било дел од апликацијата.

```jsx
import React, { createContext, useState, useContext } from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog';

const ConfirmationDialogContext = createContext();

export const useConfirmationDialog = () => {
  return useContext(ConfirmationDialogContext);
};

export const ConfirmationDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const showConfirmationDialog = (title, message, onConfirm) => {
    setTitle(title);
    setMessage(message);
    setOnConfirm(() => onConfirm);
    setOpen(true);
  };

  return (
    <ConfirmationDialogContext.Provider value={{ showConfirmationDialog }}>
      {children}
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={title}
        message={message}
      />
    </ConfirmationDialogContext.Provider>
  );
};
```

**Објаснување на клучните концепти:**
- **React Context (`ConfirmationDialogContext`)**: овој контекст ја складира и обезбедува пристапот до функцијата `showConfirmationDialog`, која може да го активира дијалогот од каде било во апликацијата.
- **Управување со состојби**: Ја складираме состојбата на дијалогот („отворен“, „порака“, „наслов“, „onConfirm“) во контекстот. Функцијата `showConfirmationDialog` е одговорна за поставување на овие вредности, што ќе го активира прикажувањето на дијалогот.
- **Глобална состојба**: со користење на контекст, дијалогот за потврда е глобално достапен, така што може да се пристапи и активира од кој било дел од апликацијата.

---

#### Чекор 3: Околу апликацијата ставете го Context Provider

За да го направите дијалогот за потврда достапен од која било страница или компонента во вашата апликација, ставете ја целата апликација (или дел од неа) со компонентата `ConfirmationDialogProvider`.

```jsx
import React from 'react';
import { ConfirmationDialogProvider } from './context/ConfirmationDialogContext';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <ConfirmationDialogProvider>
      <HomePage />
      <LoginPage />
      ...
    </ConfirmationDialogProvider>
  )
}
```

И на страниците можете едноставно да го увезете и да го повикате методот `showConfirmationDialog` ќе го прикаже дијалогот

```jsx
import { useConfirmationDialog } from '../../contexts/ConfirmationDialogContext';

const HomePage = () => {
  const { showConfirmationDialog } = useConfirmationDialog();


  const openDialog = () => {
    showConfirmationDialog(
      'Hello', 
      'You clicked the button on home page',
      () => consloe.log('Confirm the click'))
  }

  return(
    <Box>
      <Button onClick={() => openDialog()}> Click me </Button>
    </Box>
  );

};
```

Ова е краток пример за тоа како да се користи дијалогот на една страница, ние секогаш можеме да го прилагодиме методот на `showConfirmationDialog` за да додадеме повеќе сопствени работи во нашиот дијалог.

======

## Што е i18next и зошто го користам

i18next е рамка за JavaScript која обезбедува ракување со преводи и локализација во апликациите. Ви овозможува да управувате со повеќе јазици, да се префрлате помеѓу нив и да ракувате со различни функции за локализација како плурализација, форматирање и друго. Широко се користи во апликациите React за создавање повеќејазични апликации. Добрите страници за користење i18next во апликацијата React вклучуваат апликации што таргетираат повеќе јазични региони или оние што нудат содржини на различни јазици, како што се платформи за е-трговија, блогови и платформи за глобални услуги, каде што корисниците од различно јазично потекло треба да комуницираат со апликацијата на нивниот омилен јазик.

### **Објаснување за поставувањето**

#### **1. Иницијализација на i18next**

``` Javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
```
- `i18next`: Ова е основната библиотека за интернационализација. Управува со јазичните ресурси и клучевите за превод и се справува со префрлување јазик.
- `initReactI18next`: ова е приклучок што интегрира `i18next` со React. Им овозможува на компонентите на React да ги користат функциите за превод обезбедени од `i18next`.

#### **2. Вчитувам ресурси за превод**

``` Javascript
import translationEN from './locales/en/translation.json';
import translationMK from './locales/mk/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  mk: {
    translation: translationMK,
  },
};
```
- Преведувачките датотеки (`translationEN.json` и `translationMK.json`) ги содржат вистинските преводи за секој јазик.
 - На пример, датотеката `translationEN.json` може да изгледа вака:
 ```json
    {
        "welcome": "Welcome to our app!"
    }
 ```
 - Слично, `translationMK.json` може да изгледа вака:
 ```json
    {
        "welcome": "Добредојдовте во нашата апликација!"
    }
 ```
- Објектот `resources` ги организира овие преводи по јазичен код (на пр., `en` за англиски, `mk` за македонски). Секој јазик има клуч за превод, кој укажува на соодветната JSON-датотека.

#### **3. i18следна конфигурација**

```javascript
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'mk',  // Default language
    fallbackLng: 'mk'  // Fallback language if the selected language is unavailable
  });
```

- `.use(initReactI18next)`: ова го интегрира `i18next` со React, овозможувајќи им на компонентите на React да користат преводи.
- `.init()`: Ова ја иницијализира инстанцата на `i18next` со:
 - `resources`: Ги содржи датотеките за превод.
 - `lng`: Стандардниот јазик за апликацијата (во овој случај, македонски `mk`).
 - `fallbackLng`: Јазикот на кој треба да се врати ако недостасува превод на избраниот јазик (тука, стандардно е и македонски).

#### **4. Се извезува i18n**

```javascript
export default i18n;
```
Ова го прави примерот на `i18n` достапен за употреба во други делови од апликацијата.

---

### **Користење преводи во компоненти**

Во вашите компоненти, ја користите методата `useTranslation` за пристап до функцијата за превод (`t`), која ви овозможува да ја добиете преведената низа за даден клуч.

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return <h1>{t('welcome')}</h1>; // Translates the 'welcome' key
};
```

- 't('добредојде')' ќе го врати преводот врз основа на тековниот јазик. На пример, ако јазикот е поставен на `mk`, тој ќе врати `Добредојдовте во нашата апликација!`, а ако е поставен на `en`, ќе врати `"Welcome to our app!"`.

---

### **Зошто ова е добро за мојот проект**

1. **Повеќејазична поддршка**: ова поставување овозможува мојата апликација лесно да поддржува повеќе јазици, овозможувајќи поширока публика преку менување на јазик за луѓе од различни региони или јазични преференции.

2. **Приспособливост**: Како што расте вашиот проект и треба да додадам повеќе јазици, можам едноставно да додадам нови датотеки за превод (на пр. „translationES.json“ за шпански) и да го проширам објектот `resources`.

3. **Централизирани преводи**: со централизирани клучеви и вредности за превод во датотеките JSON, полесно е да се управуваат и ажурираат преводите без да се менува директно логиката на апликацијата или компонентите на интерфејсот.

4. **Динамично менување јазик**: библиотеката `i18next` обезбедува можност за менување јазици при извршување, што е корисно за корисниците кои сакаат динамично да го менуваат јазикот на апликацијата без повторно да ја вчитаат страницата.

5. **Механизам за враќање**: Конфигурацијата `fallbackLng` осигурува дека ако недостасува превод за одреден клуч на избраниот јазик, апликацијата ќе се врати на стандардниот јазик, избегнувајќи скршен интерфејс или непреведен текст.

---


### **Заклучок**

Користењето на `i18next` и `react-i18next` за управување со преводи во вашата апликација React е робустен и скалабилен пристап. Тоа е корисно за проекти за кои е потребна повеќејазична поддршка или можеби ќе треба да се прошират на меѓународно ниво. Ви овозможува да одржувате чист, локализиран код, лесно да додавате нови јазици и да ја подобрите пристапноста за глобалната публика. Меѓутоа, за помали проекти со ограничени потреби за локализација, може да внесе непотребна сложеност.



=====


### **Објаснување на табели за администраторски корисници**

Во овој пример јас користам **Material-UI (MUI) Table** во React за управување и прикажување на податоците за резервацијата. Ајде да разложиме како функционира табелата во овој контекст и придобивките од нејзиното користење во мојот проект.

### **Како функционира табелата во мојот код**

1. **Структура на табела (глава и тело)**:
 - Компонентата `Table` во MUI е составена од повеќе детски компоненти, како што се `TableHead`, `TableBody`, `TableRow` и `TableCell`, кои ја дефинираат структурата на табелата.
 - Табелата е поделена на два главни дела:
 - `Table Head`: Ги дефинира заглавијата за секоја колона, како што се Име, Телефонски број, Модел, Опис, Тип, Датум и Дејства.
 - `TableBody`: Ги задржува вистинските редови со податоци. Секој `TableRow` претставува резервација, а секоја `TableCell` во тој ред прикажува специфичен атрибут (на пр., корисничко име на резервацијата, телефонски број, модел итн.).

2. **Популација на динамички податоци**:
 - Низата `filteredReservations` е мапирана за да се создадат компоненти `TableRow` за секоја резервација. Оваа низа се филтрира врз основа на барањето за пребарување (`handleFilterChange`), што им овозможува на корисниците да ја пребаруваат и филтрираат табелата.
 - За секој ред, проверувате дали редот се уредува (`editingRow`) или не, и ги прикажувате полињата за уредување или вредностите само за прикажување.

3. **Уредете и бришете дејства**:
 - Копчето `Уреди` (`IconButton` со `EditIcon`) ја активира функцијата `handleEdit`, која го поставува редот да биде во режим на уредување, дозволувајќи му на корисникот да ги ажурира податоците.
 - Копчето `Избриши` (`IconButton` со `DeleteIcon`) ја активира функцијата `handleDelete`, која ја отстранува резервацијата од состојбата (и задниот дел) по потврдата.

4. **Зачувување и бришење на уредувањата**:
 - Кога корисникот ќе заврши со уредувањето, може да кликне на копчето `Зачувај` (`IconButton` со `SaveIcon`) за да ги зачува промените. Функцијата `handleSave` ја ажурира резервацијата во состојбата и задниот дел.
 - Копчето `Исчисти` (`IconButton` со `ClearIcon`) ја ресетира формата во првобитната состојба кога корисникот ќе го откаже уредувањето.

5. **Сопаѓачки и автоматско комплетирање компоненти**:
 - Компонентата `Autocomplete` се користи за прикажување модели, обезбедувајќи му на корисникот искуство за пребарување како што пишувате за имињата на моделите.
 - Компонентата `Select` се користи за избор на тип на резервација, прикажувајќи листа на достапни типови од низата `types`.

---

### **Придобивките од користењето табели во мојот проект**

#### **1. Структурен приказ на податоци**

Табелите се ефикасен начин за прикажување на структурирани, табеларни податоци како резервации, каде што секој ред претставува индивидуален запис и секоја колона претставува специфичен атрибут (на пр. име, телефонски број, тип). Табеларниот формат им овозможува на корисниците лесно да ги споредуваат вредностите на различни записи.

Во мојот пример:
- Секоја резервација е претставена како ред.
- Секоја колона (име, телефонски број, модел, итн.) претставува својство на резервацијата.

Ова ги прави податоците многу почитливи и полесни за разбирање, особено кога се работи за сложени податоци.

#### **2. Редови што може да се уредуваат**

Способноста за динамично уредување на ред во рамките на табелата е клучна карактеристика. Со префрлање помеѓу режимот на прикажување и режимот за уредување за секој ред, корисниците можат интерактивно да ги менуваат податоците без да се движат подалеку од табелата.

- **Кога се уредува ред**, корисниците можат да внесуваат промени (на пр. телефонски број, модел, опис).
- **По зачувувањето** се прикажуваат ажурираните податоци, чувајќи корисникот во контекст на табелата.

Ова ја елиминира потребата од повеќе форми или посебни страници за уредување на поединечни записи.

#### **3. Филтрирање и пребарување на податоци**

Функцијата за пребарување која им овозможува на корисниците да ги филтрираат резервациите врз основа на која било од вредностите на редот. Функционалноста за пребарување работи со споредување на барањето со вредностите на секоја резервација и ажурирање на состојбата за да се прикажат само резултатите што се совпаѓаат.

- **Филтрирањето** им овозможува на корисниците брзо да ги стеснуваат резултатите врз основа на клучен збор (на пр., одредено име на модел или телефонски број на корисникот).
- Ова е особено корисно во табелите со големи збирки на податоци, бидејќи им помага на корисниците да најдат конкретни податоци без рачно лизгање низ големи количини на информации.

#### **4. Бришење податоци со потврда**

Табелата ја вклучува и можноста за бришење податоци (резервации) со дијалог за потврда. Ова осигурува дека корисниците не случајно бришат важни податоци, подобрувајќи го корисничкото искуство и обезбедувајќи безбедносна мрежа пред да извршат потенцијално деструктивно дејство.

- **Дијалогот за потврда** осигурува дека корисникот свесно избира да избрише резервација.
- По бришењето, табелата динамично се ажурира за да ја одрази промената, давајќи му веднаш повратна информација на корисникот.

#### **5. Одговорен дизајн и пристапност**

Табелата MUI реагира и овозможува лесно прилагодување на стилот и однесувањето (на пр., лепливи заглавија, филтрирање и динамични висини на редови). Можеме да додадеме и функции како што се страници, сортирање и друго.

- **Лепливите заглавија** (реквизитот `stickyHeader` на компонентата `Table`) гарантираат дека имињата на колоните се секогаш видливи додека се движите, со што се подобрува употребливоста.
- **Одговорното однесување** осигурува дека табелата се прилагодува на различни големини на екранот, што ја прави прифатлива за корисниците на мобилни и десктоп уреди.

#### **6. Интеграција со Backend Services**

Податоците од табелата во мојот пример се преземаат од `backend` со користење на функции како `fetchReservations`, `fetchModels` и `fetchTypes`. Способноста за асинхроно вчитување податоци во табелата ја прави скалабилна за големи збирки на податоци и динамична содржина.

- **Ваќањето податоци асинхроно** значи дека табелата може да прикажува податоци во реално време или податоци кои постојано се ажурираат на `backend`.
- Ова е од клучно значење за администраторските контролни табли или системите за резервации каде што податоците често се менуваат (на пр., се додаваат нови резервации или се ажурираат постоечките резервации).

#### **7. Модуларност и повторна употреба**

Поставувањето на табелата е модуларно и секој дел (на пр., редовите, ќелиите, па дури и дејствата како уредување и бришење) може повторно да се користат низ различни компоненти во мојата апликација. Можеме да креираме слични табели за други ентитети (на пр. корисници, производи итн.) со едноставно пренесување на различни податоци и дејства.

Ова ја задржува кодот DRY (Don’t Repeat Yourself)  и ви помага да одржувате постојано однесување и изглед низ различни делови од апликацијата.

#### **8. Приспособување **

Користењето на компонентите на MUI обезбедува флексибилност за прилагодување, како што се:
- Прилагоден стил (бои, позадини, граници).
- Прилагодено прикажување на ќелии (на пр., прикажување датуми во одреден формат или прикажување приспособени икони за дејства).
- Користењето на други компоненти на MUI како `TextField`, `Autocomplete`, `Select` итн., во врска со табелата овозможува богати, интерактивни интерфејси.

---

### **Заклучок**

Табелите се суштинска компонента кога треба да прикажувате, управувате и да комуницирате со структурирани податоци. Тие обезбедуваат неколку придобивки, вклучувајќи структурирана презентација, лесно уредување, можност за пребарување и манипулација со податоци. Во вашиот проект, употребата на табели со динамични редови, филтри и дијалози за потврда го подобрува корисничкото искуство додека го прави процесот на управување со податоци ефикасен и рационализиран.