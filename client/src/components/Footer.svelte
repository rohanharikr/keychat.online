<script>
    import { onMount } from 'svelte';
    import countapi from 'countapi-js';

    let hits, id;

    onMount( async ()=>{
        await countapi.visits('global').then((result) => {
              hits = (result.value + 2170) // migrated 2170 count form chatsecure.online
        });

        // await fetch('https://api.github.com/repos/rohanharikr/keychat.online/commits')
        //     .then((response) => response.json())
        //     .then((data) => {
        //     id = data[0].sha.slice(0, 7)
        // })
    })

</script>


<footer class="footer">
    <div class="footerContainer">
        <img src="assets/chatsecureonline.svg" alt="logo" class="logo">
        <ul>
            <li>&#169; 2020 MIT License</li>
            <li><a href="https://www.twitter.com/rohanharikr">made by rohanharikr</a></li>
            <li>{hits || '...'} happy souls</li>
            <li><a href="https://growwwkit.com/">illustrations from growwwkit</a></li>
            <!-- <li>commit {id || '...'}</li> -->
            <li class="link" style="margin-bottom: 0.2rem;">
                <a href="https://github.com/rohanharikr/keychat.online">
                    <img src="assets/github.svg" alt="github logo" class="footericon">
                </a>
            </li>
<!--             <li class="ph">
                <a href="https://www.producthunt.com/posts/keychat?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-keychat" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=269286&theme=dark" alt="Keychat - Start a free secure chat with anyone without signing up | Product Hunt" style="height: 2.4rem;"/></a>
            </li> -->
        </ul>
        <img src="assets/chatsecureonline.svg" alt="logo" class="mobileLogo">
    </div>
</footer>

<style>
    footer{
        margin-top: 4rem;
        background: var(--grey);
        height: 6rem;
        width: 100%;
    }

    .footerContainer{
        padding: 1.2rem;
        height: 100%;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .footericon{
        height: 1rem;
        margin-right: 0.4rem;
    }

    .logo{
        filter: grayscale(100%);
        height: 1.8rem;
        opacity: 0.8;
        margin-right: 1rem;
    }

    .link{
        display: flex;
        align-items: center;
    }

    ul{
        columns: 3;
        font-weight: 400;
        font-size: 0.8rem;
        margin-left: 12.6rem;
        opacity: 0.8;
        column-gap: 6rem;
    }

    ul li{
        /*margin-bottom: 0.4rem;*/
        cursor: pointer;
        /*transition: 0.3s;*/
    }

    li:hover{
        filter: brightness(180%);
    }

    .mobileLogo{
        display: none;
    }

    @media only screen and (max-width: 1024px) {
        footer{
            margin-top: 2rem;
            height: auto;
            padding: 1rem 2rem;
        }

        .footerContainer{
            width: auto;
            padding: 0;
        }

        ul{
            columns: 1;
            margin: 0;
        }

        ul li{
            margin-bottom: 0.8rem;
        }

        .logo{
            display: none;
        }

        .mobileLogo{
            margin-bottom: -0.4rem;
        }

        .mobileLogo{
            display: block;
            height: 1.6rem;
            float: right;
            margin-left: auto;
            filter: grayscale(100%);
            opacity: 0.8;
            margin-top: -4.4em;
        }
        .ph{
            margin-top: 1.2rem;
        }
    }
</style>
