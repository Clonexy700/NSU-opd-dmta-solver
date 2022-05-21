# Создание нового функционала

## Корневая и папочная структура

Если собираетесь вносить в сервис какой-либо новый функционал, то все JavaScript файлы следует распологать в папке src.
К функционалу следует писать как минимум Unit - тесты и распологать в папке tests, а ещё лучше кроме этого писать E2E тесты и распологать их в cypress.
Все иконки, изображения располагаются в img.
Таблицы стилей в styles.


## Создание нового функционала

Просто добавить новый .html в корневую папку проекта и не забыть добавить на него ссылки в навигационном меню остальных html-файлов.

Также к любому новому созданному .html следует в обязательном порядке подключать в head следующее:

```html
<head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <link href='http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500italic,700,500,700italic,900,900italic' rel='stylesheet' type='text/css'>
    <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

    <link rel="shortcut icon" type="image/x-icon" href="/img/favicon.ico" />

    <link rel="stylesheet" href="/styles/main.css">
    <link rel="stylesheet" type="text/css" href="styles/tablesContent.css">
</head>
```

Да, в проекте используется Bootstrap.

После подключения всего необходимого следует в body создать div с id="page" и добавить навигационное меню в header: 
```html
<header>


    <div class="menu_block bg-home fixed-top">


        <div class="container clearfix">


            <div class="logo">
                <a href="/index.html"><span class="b1">S</span><span class="b2">O</span><span class="b3">L</span><span class="b4">V</span><span class="b5">E</span><span class="b5">R</span></a>
            </div>


            <div class="">
                <nav class="navmenu center">
                    <ul>
                        <li class="scroll_btn"><a href="/index.html">О сервисе</a></li>
                        <li class="scroll_btn"><a href="/stateMachine.html">Конечные автоматы</a></li>
                        <li class="scroll_btn"><a href="/turingMachine.html">Машины Тьюринга</a></li>
                        <li class="scroll_btn"><a href="/about.html">Новости</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</header>
```

После чего с помощью Bootstrap создаём контейнер, к примеру следующим образом, чтобы не выбиваться из стиля проекта:

```html
<div id="box" class="container rounded border border-dark p-3 bg-fff" style="height:50vh; overflow: auto">
    ... Далее всё что угодно вашей фантазии и реализуемому функционалу
</div>
```

Не рекомендуется менять изначальные используемые стили, максимум, что вы можете поменять, так это добавить в новом .html тег styles и указать в нём ссылку на другой задний фон:

```html
<style>
    body {
        background-image: url(/img/blur_background_1/2/3/4/. . ./100500.png);
    }
</style>
```

Все необходимые шрифты, картинки, исходники, фоны есть здесь:
https://mca.nsu.ru/mmfstyle/
Ими разрешено беспрепятственно пользоваться. На фон следует наложить Blur эффект 20-30%.

В принципе на этом всё о добавлении нового функционала, а прочитать о работе существующего вы можете в других разделах документации.

## Типичные стилевые приёмы
Не забывайте, что в документации не используются стили из сервиса, поэтому примеры здесь могут отличаться, но показывают суть.

Кнопки:

Сплошная
```html
<button class="btn btn-success my-2 mx-auto m-md-2" id="id_которое_будем_обрабатывать" >Текст</button>
```

С обводкой
```html
<button class="btn btn-outline-success rounded-pill d-block font-weight-bold" id="id_которое_будем_обрабатывать">Текст</button>
```


