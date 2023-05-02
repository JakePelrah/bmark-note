
import { useEffect, useRef } from "react"
import { Popover } from "bootstrap"
import { v4 as uuidv4 } from 'uuid';


function App() {

  let result = useRef()
  let popoverRef = useRef()
  let removePopoverRef = useRef(null)


  useEffect(() => {

    // find where the selection begins and ends
    document.onselectionchange = () => {

      const sel = document.getSelection()

      // avoid ending selection in scene wrapper div
      const avoid = document.querySelector('[data-section="scene-wrapper"]')


      // if selection start and end is not in the wrapper
      // and the selection is not collapsed
      if (!sel?.focusNode?.isEqualNode(avoid)
        && !sel?.anchorNode?.isEqualNode(avoid)
        && !sel.isCollapsed) {
        result.current = sel
      };
    }
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('mouseover', onMouseOver)
  }, [])



  // https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
  function clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }


  


  function multiHigh(selection) {

    // get range
    const myRange = selection.getRangeAt(0)
    const { startContainer, endContainer, startOffset, endOffset } = myRange


    // get parentnode of selection
    const { parentNode, nodeValue } = startContainer

    var _iterator = document.createNodeIterator(
      myRange.commonAncestorContainer,
      NodeFilter.SHOW_ALL, // pre-filter
      {
        // custom filter
        acceptNode: function (node) {
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    var hasHighlight = false
    let currentNode;
    while ((currentNode = _iterator.nextNode())) {
      if (currentNode.parentNode.className === "highlight") {
        hasHighlight = true
        break
      }
    }

    if (startContainer.parentNode.className === "highlight"
      || endContainer.parentNode.className === "highlight"
      || hasHighlight) {

      alert('cant highlight previous area')
      return
    }

    // if were not in a highlight
    const first = nodeValue.substring(0, startOffset)
    const highlight = nodeValue.substring(startOffset, endOffset)
    const last = nodeValue.substring(endOffset)

    // create highlight
    const highSpan = document.createElement('span')
    highSpan.dataset.highlightid = uuidv4()
    highSpan.classList.add('highlight')
    highSpan.innerText = highlight

    // create fragment
    const fragment = document.createDocumentFragment();
    fragment.append(first)
    fragment.append(highSpan)
    fragment.append(last)

    parentNode.replaceChild(fragment, startContainer)
  }

  function createPopover(elem) {

    // button group
    const btnGroup = document.createElement('div')
    btnGroup.classList.add('btn-group')

    // bookmark
    const bookmarkBtn = document.createElement('button')
    bookmarkBtn.classList.add('btn')
    bookmarkBtn.innerHTML = '<i style="pointer-events:none;" class="bi bi-bookmark"></i>'
    bookmarkBtn.onclick = (e) => {
      e.preventDefault()
      multiHigh(result.current)
      clearSelection()
      result.current = null
      popoverRef.current.dispose()
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

  function removeEditPopover(elem, highlightId, timeoutId) {

    // button group
    const btnGroup = document.createElement('div')
    btnGroup.classList.add('btn-group')

    const noteBtn = document.createElement('button')
    noteBtn.classList.add('btn')
    noteBtn.innerHTML = '<i style="pointer-events:none;" class="bi bi-pencil-square"></i>'
    noteBtn.onclick = (e) => {
      e.preventDefault()
    }

    const removeBtn = document.createElement('button')
    removeBtn.classList.add('btn')
    removeBtn.innerHTML = '<i style="pointer-events:none;" class="bi bi-trash3"></i>'
    removeBtn.onclick = (e) => {
      e.preventDefault()
      clearTimeout(timeoutId)
      const highlights = document.querySelectorAll(`[data-highlightid="${highlightId}"`)
      console.log(e, highlights, highlightId)
      highlights.forEach(node => {
        const ct = node.closest('.character-text')
        const c = node.closest('.character')
        node.replaceWith(...node.childNodes)
        ct?.normalize()
        c?.normalize()
      })
      removePopoverRef.current.dispose()
      removePopoverRef.current = null
    }

    btnGroup.append(noteBtn)
    btnGroup.append(removeBtn)

    var popover = new Popover(elem, {
      container: 'body',
      content: btnGroup,
      html: true,
    })
    return popover
  }



  function onPointerDown(e) {

    const popoverGroup = e.target.parentNode.className === "btn-group"
    const popoverBody = e.target.className === "popover-body"

    if (popoverRef.current?._isEnabled && !popoverGroup && !popoverBody) {
      clearSelection()
      popoverRef.current.dispose()
    }
  }


  function onPointerUp(e) {

    // get the text selection
    const { focusNode } = result.current || {}

    const popoverGroup = e.target.parentNode.className === "btn-group"
    if (result.current && !result.current.isCollapsed && !popoverGroup) {
      popoverRef.current = createPopover(focusNode.parentElement)
      popoverRef.current.show()
    }
  }


  function onMouseOver(e) {
    if ('highlightid' in e.target.dataset
      && removePopoverRef.current === null) {

      const timeoutId = setTimeout(() => {
        removePopoverRef.current.dispose()
        removePopoverRef.current = null
      }, 3000)
      const pover = removeEditPopover(e.target, e.target.dataset['highlightid'], timeoutId)
      pover.show()
      removePopoverRef.current = pover
    }
  }


  return (
    <div className="p-5" data-section="scene-wrapper" id="LastRoseofSummer">
      <h2 class="fancy-title title-border-color">Last Rose of Summer</h2>
      <br />
      <br />

      <span data-section="prologue">
        <blockquote>
          <b>EXTERIOR SCENE. IN FRONT OF JACOB’S HOUSE - LATE AFTERNOON</b>
          <br />
          <em>
            September 1993. Summer late-day turning into night outside. Jacob and his friends are outside in front
            of his house playing kickball on the street, while his mother and his friends’ moms are inside his house
            socializing.
          </em>
        </blockquote>
      </span>

      <span data-section="audioButton">
        <div class="center">&#8230;</div><br />
        <div class='audioButton' data-path='/audio/transitions/Time.m4a' data-type='transition'>
        </div>
      </span>

      <div data-section="1">
        <div class="character">NARRATOR:</div>
        <span class="character-text">
          More than 200 Sunday services passed from that day and, about four years later, late in the summer of 1993,
          eleven-year-old Jacob was focused on the Sunday night kickball game he was having in front of his house.
        </span>
      </div>

      <div data-section="2">
        <div class="character">JACOB:</div>
        <span class="character-text">
          Okay, Rob is up!
        </span>
      </div>

      <div data-section="3">
        <div class="character">NARRATOR:</div>
        <span class="character-text">
          Jacob’s cousin, Rob, who lived directly across the street, was walking over to the makeshift batter’s box
          their
          friend Lylia had outlined in chalk on the street a few hours earlier. Rob’s little sister Lori Beth and
          Lylia were
          standing behind Jacob on their chalk-outlined pitcher’s mound.
        </span>
      </div>

      <div data-section="4">
        <div class="character">ROB:</div>
        <span class="character-text">
          Better back up!
        </span>
      </div>


      <div data-section="5">
        <div class="character">NARRATOR:</div>
        <span class="character-text">
          Jacob pitched the kickball down the center of their dead-end street, and Rob ran toward the ball as fast as he
          could. He kicked it hard to the left and nearly knocked his sister over as she tried to protect herself. <br />
        </span>
      </div>


      <div class="center"><i class="icon-circle dot"></i></div><br />
    </div>
  );
}

export default App;
