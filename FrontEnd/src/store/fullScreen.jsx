// import { create } from "zustand"

// const exitFullscreenMethods = [
//     'exitFullscreen',
//     'webkitExitFullscreen',
//     'msExitFullscreen',
//     'mozCancelFullScreen'
// ]

// const fullscreenMethods = [
//     'requestFullscreen',
//     'webkitRequestFullscreen',
//     'msRequestFullscreen',
//     'mozRequestFullScreen'
// ]

// function fullScreen( array ) {
//     let Fn = array.find((method) => document[method])

//     if (Fn) document[Fn]()
//     else {
//         console.error('Full Screen Error', Fn)
//         return false
//     }

//     return true
// }

// /** Full Screen Store */
// const useSettingsStore = create((set) => ({
//     isFullScreen: false,
//     toggleFullScreen: () => {
//         set((state) => {
//             if (state.isFullScreen)  {
//                 fullScreen(exitFullscreenMethods)
//             }
//             else {
                
//             }

//             return { isFullScreen: !state.isFullScreen }
//         })
//     }
// }))

// export default useSettingsStore