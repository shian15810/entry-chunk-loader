import '../../index.js?path=children&name=child1.js!./child.js';
import '../../index.js?inert&path=inertOut!./manifest.notjson';
import '../../index.js?inert&name=[name]-inert.[hash:6].js!./defaults';
import '../../index.js?name=[name].[hash:6].js!./defaults';
import '../../index.js!./defaults';
import './other.entry.js';
