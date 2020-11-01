import '../../index.cjs?path=children&name=child1.js!./child.js';
import '../../index.cjs?inert&path=inertOut!./manifest.notjson';
import '../../index.cjs?inert&name=[name]-inert.[hash:6].js!./defaults';
import '../../index.cjs?name=[name].[hash:6].js!./defaults';
import '../../index.cjs!./defaults';
import './other.entry.js';
