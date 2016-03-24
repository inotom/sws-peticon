package peticon

import (
	"bytes"
	"encoding/xml"
)

const (
	svgHeader  = "<?xml version=\"1.0\" standalone=\"no\"?>"
	svgDoctype = "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">"
)

// Figure is interface of shape object
type Figure interface {
	Draw(w, h int) string
}

// Polygon is struct of shape(polygon) for xml
type Polygon struct {
	XMLName xml.Name `xml:"polygon"`
	Fill    string   `xml:"fill,attr"`
	Stroke  string   `xml:"stroke,attr"`
	Points  string   `xml:"points,attr"`
}

// Draw is method to return svg code
func (p *Polygon) Draw(w, h int) string {
	svg := Svg{
		Width:   w,
		Height:  h,
		Version: "1.1",
		Xmlns:   "http://www.w3.org/2000/svg",
		Figure:  p,
	}

	var buf bytes.Buffer
	buf.WriteString(svgHeader)
	buf.WriteString(svgDoctype)

	b, _ := xml.Marshal(svg)
	buf.Write(b)

	return buf.String()
}

// Circle is struct of shape(circle) for xml
type Circle struct {
	XMLName xml.Name `xml:"circle"`
	Fill    string   `xml:"fill,attr"`
	Stroke  string   `xml:"stroke,attr"`
	Cx      int      `xml:"cx,attr"`
	Cy      int      `xml:"cy,attr"`
	R       int      `xml:"r,attr"`
}

// Draw is method to return svg code
func (c *Circle) Draw(w, h int) string {
	svg := Svg{
		Width:   w,
		Height:  h,
		Version: "1.1",
		Xmlns:   "http://www.w3.org/2000/svg",
		Figure:  c,
	}

	var buf bytes.Buffer
	buf.WriteString(svgHeader)
	buf.WriteString(svgDoctype)

	b, _ := xml.Marshal(svg)
	buf.Write(b)

	return buf.String()
}

// Svg is struct of svg for xml
type Svg struct {
	XMLName xml.Name `xml:"svg"`
	Width   int      `xml:"width,attr"`
	Height  int      `xml:"height,attr"`
	Version string   `xml:"version,attr"`
	Xmlns   string   `xml:"xmlns,attr"`
	Figure  Figure   `xml:"figure"`
}
