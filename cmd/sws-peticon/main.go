package main

import (
	"encoding/json"
	"flag"
	"github.com/inotom/sws-peticon"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"
)

// IconShape は形状選択 JSON のためのデータ形式
type IconShape struct {
	Key   string `json:"key"`
	Label string `json:"label"`
}

// 形状選択 JSON 用スライス
var iconShapes = []IconShape{
	IconShape{
		Key:   "tr-right",
		Label: "右三角形",
	},
	IconShape{
		Key:   "tr-left",
		Label: "左三角形",
	},
	IconShape{
		Key:   "tr-up",
		Label: "上三角形",
	},
	IconShape{
		Key:   "tr-down",
		Label: "下三角形",
	},
	IconShape{
		Key:   "rect",
		Label: "正方形",
	},
	IconShape{
		Key:   "rhombus",
		Label: "ひし形",
	},
	IconShape{
		Key:   "circle",
		Label: "円形",
	},
}

type templateHandler struct {
	once     sync.Once
	filename string
	templ    *template.Template
}

func (t *templateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	t.once.Do(func() {
		t.templ = template.Must(template.ParseFiles(filepath.Join("templates", t.filename)))
	})
	if err := t.templ.Execute(w, nil); err != nil {
		log.Fatalf("templateHandler.ServeHTTP:", err)
	}
}

// 色選択 URI 引数処理
func queryColor(color string) string {
	if len(color) > 0 {
		return "#" + color
	}
	return "orange"
}

// 形状選択 URI 引数処理
func queryShape(shape string, color string) peticon.Figure {
	var figure peticon.Figure
	switch shape {
	case "tr-right":
		figure = &peticon.Polygon{
			Fill:   color,
			Stroke: "none",
			Points: "15,0,15,100,95,50",
		}
	case "tr-left":
		figure = &peticon.Polygon{
			Fill:   color,
			Stroke: "none",
			Points: "85,0,85,100,5,50",
		}
	case "tr-up":
		figure = &peticon.Polygon{
			Fill:   color,
			Stroke: "none",
			Points: "50,5,100,85,0,85",
		}
	case "tr-down":
		figure = &peticon.Polygon{
			Fill:   color,
			Stroke: "none",
			Points: "50,95,100,15,0,15",
		}
	case "rect":
		figure = &peticon.Polygon{
			Fill:   color,
			Stroke: "none",
			Points: "0,0,100,0,100,100,0,100",
		}
	case "rhombus":
		figure = &peticon.Polygon{
			Fill:   color,
			Stroke: "none",
			Points: "50,0,100,50,50,100,0,50",
		}
	case "circle":
		figure = &peticon.Circle{
			Fill:   color,
			Stroke: "none",
			Cx:     50,
			Cy:     50,
			R:      50,
		}
	default:
		figure = &peticon.Polygon{
			Fill:   color,
			Stroke: "none",
			Points: "15,0,15,100,95,50",
		}
	}
	return figure
}

func main() {
	var addr = flag.String("addr", "", "アプリケーションのアドレス")
	flag.Parse() // フラグを解析

	// TOP ページ
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		t := &templateHandler{filename: "home.html"}
		t.ServeHTTP(w, r)
	})

	// 形状選択 JSON データを出力
	http.HandleFunc("/shapes.json", func(w http.ResponseWriter, r *http.Request) {
		bytes, err := json.Marshal(iconShapes)
		if err != nil {
			log.Fatalln("json Marshal error", err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(bytes)
	})

	// svg アイコンを出力
	http.HandleFunc("/icon.svg", func(w http.ResponseWriter, r *http.Request) {
		// URI 引数を取得して svg の色と形状を設定する
		query := r.URL.Query()
		// 色
		color := queryColor(query.Get("c"))
		// 形状
		var figure peticon.Figure
		figure = queryShape(query.Get("s"), color)
		// サイズ
		width := 100
		height := 100

		svgStr := figure.Draw(width, height)
		w.Header().Set("Content-Type", "image/svg+xml")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(svgStr))
	})

	// アセットファイル
	http.Handle("/assets/",
		http.StripPrefix("/assets",
			http.FileServer(http.Dir("./assets"))))

	if *addr == "" {
		port := os.Getenv("PORT")
		*addr = ":" + port
		if port == "" {
			log.Fatalln("$PORT must be set")
		}
	}

	// Web サーバを開始
	log.Println("Webサーバを開始します。ポート：", *addr)
	if err := http.ListenAndServe(*addr, nil); err != nil {
		log.Fatalf("ListenAndServe:", err)
	}
}
