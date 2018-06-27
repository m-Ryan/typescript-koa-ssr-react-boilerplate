import *  as React from 'react'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module 'react' {
    interface HTMLAttributes < T > extends DOMAttributes < T > {
        styleName?: string
    }
}
