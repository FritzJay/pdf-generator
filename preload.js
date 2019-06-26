const fs = require('fs')

// May be used to write pdfs. We might not need this after all.
const PdfDocument = require('pdfkit')

// Used to read and possibly write pdfs
const pdfjsLib = require('pdfjs-dist')
const workerPath = require.resolve('pdfjs-dist/build/pdf.worker.js')
pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  for (const versionType of ['chrome', 'electron', 'node']) {
    document.getElementById(`${versionType}-version`).innerText = process.versions[versionType]
  }

  loadPdf()
})

function loadPdf() {
  console.log('Loading PDF...')
  const pathPDF = './pdf/video_server.pdf'

  pdfjsLib.getDocument(pathPDF).promise.then(function (doc) {
    console.log(doc)
    doc.getPage(1).then(function (page) {
      console.log(page)

      page.getAnnotations().then(function (annotations) {
        console.log(annotations)
        const annotationsValues = {
          Technician: 'Test'
        }
        setAnnotations(annotationsValues, annotations)

        // renderPage(page)

        savePDF(doc)

        doc.cleanup()

        savePDF(doc)
      })
    })
  }, function (error) {
    console.error(error)
  })
}

function setAnnotations(values, annotations) {
  Object.keys(values).forEach(function (annotationName) {
    const matchingAnnotation = getMatchingAnnotation(annotationName, annotations)
    matchingAnnotation.fieldValue = 'Test'
  })
}

function getMatchingAnnotation(fieldName, annotations) {
  return annotations.find(function (annotation) {
    return annotation.fieldName === fieldName
  })
}

function renderPage(page) {
  const scale = 1
  const viewport = page.getViewport({
    scale: scale
  })

  // Prepare canvas using PDF page dimensions
  const canvasContainer = document.getElementById('canvas-container')
  const canvas = document.createElement('canvas')
  canvasContainer.appendChild(canvas)
  var context = canvas.getContext('2d')
  canvas.height = viewport.height
  canvas.width = viewport.width

  // Render PDF page into canvas context
  var renderContext = {
    canvasContext: context,
    viewport: viewport
  }
  var renderTask = page.render(renderContext)
  renderTask.promise.then(function () {
    console.log('Page rendered')
  })
}

function savePDF(doc) {
  doc.getData().then(function (data) {
    console.log(data)
  })
}