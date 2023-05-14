
import { useEffect, useRef } from "react"
import { Popover } from "bootstrap"



function App() {

  let popoverRef = useRef({ ref: null, timeoutId: null, section: null })

  useEffect(() => {
    document.addEventListener('mouseover', onMouseOver)
  }, [])




  function onMouseOver(e) {

    // elements to show popover on
    if (e.target.nodeName === "B") {


      // get section
      const {section} = e.target.closest("[data-section]").dataset

      // if element has a popover
      if(popoverRef.current.section === section){
        console.log('has a popover')
        return
      }

      if(popoverRef.current.section && popoverRef.current.section != section){
        clearTimeout(popoverRef.current.timeoutId)
        popoverRef.current.ref.dispose()
        popoverRef.current = { ref: null, timeoutId: null, section: null }
      }


      // create popover
      popoverRef.current.ref = createPopover(e.target)
      popoverRef.current.ref.show()
      popoverRef.current.section = section
      const timeoutId = setTimeout(() => {
        popoverRef.current.ref.dispose()
        popoverRef.current = { ref: null, timeoutId: null, section: null }
      }, 3000)
      popoverRef.current.timeoutId = timeoutId
    }

  }


  function createPopover(elem) {

    // button group
    const btnGroup = document.createElement('div')
    btnGroup.classList.add('btn-group')

    // bookmark
    const bookmarkBtn = document.createElement('button')
    bookmarkBtn.classList.add('btn')
    bookmarkBtn.innerHTML = '<i style="pointer-events:none;" class="bi bi-bookmark"></i>'
    bookmarkBtn.onclick = function(e){
      e.preventDefault()
      alert('bookmark')
      }

    const noteBtn = document.createElement('button')
    noteBtn.classList.add('btn')
    noteBtn.innerHTML = '<i style="pointer-events:none;" class="bi bi-pencil-square"></i>'
    noteBtn.onclick = (e) => {
      e.preventDefault()
      alert('note')
    }

    btnGroup.append(bookmarkBtn)
    btnGroup.append(noteBtn)

    var popover = new Popover(elem, {
      container: 'body',
      content: btnGroup,
      html: true,
    })
    return popover
  }




  return (
    <div id="LastRoseofSummer">
      <h2 class="fancy-title title-border-color">Last Rose of Summer</h2>
      <br />
      <br />

      <span data-section="prologue">
        <blockquote>
          <b>EXTERIOR SCENE. IN FRONT OF JACOB’S HOUSE - LATE AFTERNOON</b>
          <br />
          <em>
            September 1993. Summer late-day turning into night outside. Jacob and his friends are outside in front of his house playing kickball on the street, while his mother and his friends’ moms are inside his house socializing.
          </em>
        </blockquote>
      </span>

      <div class="center">&#8230;</div>
      <br />
      <div class='audioButton' data-path='/audio/transitions/Time.m4a' data-type='transition' >
      </div>
      <br />
      <br />

      <span data-section="1">
        <b>NARRATOR:</b>
        <br />
        More than 200 Sunday services passed from that day and, about four years later, late in the summer of 1993, eleven-year-old Jacob was focused on the Sunday night kickball game he was having in front of his house.
      </span>

      <br />
      <br />

      <span data-section="2">
        <b>JACOB:</b>
        <br />
        Okay, Rob is up!
      </span>

      <br />
      <br />

      <span data-section="3">

        <b>NARRATOR:</b>
        <br />
        Jacob’s cousin, Rob, who lived directly across the street, was walking over to the makeshift batter’s box their friend Lylia had outlined in chalk on the street a few hours earlier. Rob’s little sister Lori Beth and Lylia were standing behind Jacob on their chalk-outlined pitcher’s mound.
      </span>

      <br />
      <br />

      <span data-section="4">
        <b>ROB:</b>
        <br />
        Better back up!
      </span>

      <br />
      <br />

      <span data-section="5">
        <b>NARRATOR:</b><br />
        Jacob pitched the kickball down the center of their dead-end street, and Rob ran toward the ball as fast as he could. He kicked it hard to the left and nearly knocked his sister over as she tried to protect herself.
      </span>
      <br />
      <br />

      <div class="center"><i class="icon-circle dot"></i></div><br />
    </div>
  );
}

export default App;

