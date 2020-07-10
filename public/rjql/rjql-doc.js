
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':2334/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(html, anchor = null) {
            this.e = element('div');
            this.a = anchor;
            this.u(html);
        }
        m(target, anchor = null) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(target, this.n[i], anchor);
            }
            this.t = target;
        }
        u(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        p(html) {
            this.d();
            this.u(html);
            this.m(this.t, this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src\Editor.svelte generated by Svelte v3.18.1 */
    const file = "src\\Editor.svelte";

    function create_fragment(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*val*/ ctx[1]);
    			attr_dev(div, "id", /*eid*/ ctx[0]);
    			add_location(div, file, 39, 0, 866);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*val*/ 2) set_data_dev(t, /*val*/ ctx[1]);

    			if (dirty & /*eid*/ 1) {
    				attr_dev(div, "id", /*eid*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	onMount(function () {
    		setTimeout(
    			function init() {
    				editor = ace.edit(eid);
    				editor.setTheme("ace/theme/textmate");
    				editor.session.setMode("ace/mode/" + mode);
    				editor.renderer.setShowGutter(showLineNo);
    				editor.getSession().setUseWrapMode(true);
    				editor.setShowPrintMargin(false);
    				editor.setReadOnly(readOnly);

    				editor.setOptions({
    					fontFamily: "'Fira Code', monospace",
    					fontSize: fsize,
    					maxLines,
    					useWorker: false
    				});

    				window[eid] = editor;
    			},
    			50
    		);
    	});

    	let editor;
    	let { fsize = "10pt" } = $$props;
    	let { mode = "json" } = $$props;
    	let { eid } = $$props;
    	let { val } = $$props;
    	let { readOnly = false } = $$props;
    	let { showLineNo = true } = $$props;
    	let { maxLines = 10 } = $$props;
    	const writable_props = ["fsize", "mode", "eid", "val", "readOnly", "showLineNo", "maxLines"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Editor> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("fsize" in $$props) $$invalidate(2, fsize = $$props.fsize);
    		if ("mode" in $$props) $$invalidate(3, mode = $$props.mode);
    		if ("eid" in $$props) $$invalidate(0, eid = $$props.eid);
    		if ("val" in $$props) $$invalidate(1, val = $$props.val);
    		if ("readOnly" in $$props) $$invalidate(4, readOnly = $$props.readOnly);
    		if ("showLineNo" in $$props) $$invalidate(5, showLineNo = $$props.showLineNo);
    		if ("maxLines" in $$props) $$invalidate(6, maxLines = $$props.maxLines);
    	};

    	$$self.$capture_state = () => {
    		return {
    			editor,
    			fsize,
    			mode,
    			eid,
    			val,
    			readOnly,
    			showLineNo,
    			maxLines
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("editor" in $$props) editor = $$props.editor;
    		if ("fsize" in $$props) $$invalidate(2, fsize = $$props.fsize);
    		if ("mode" in $$props) $$invalidate(3, mode = $$props.mode);
    		if ("eid" in $$props) $$invalidate(0, eid = $$props.eid);
    		if ("val" in $$props) $$invalidate(1, val = $$props.val);
    		if ("readOnly" in $$props) $$invalidate(4, readOnly = $$props.readOnly);
    		if ("showLineNo" in $$props) $$invalidate(5, showLineNo = $$props.showLineNo);
    		if ("maxLines" in $$props) $$invalidate(6, maxLines = $$props.maxLines);
    	};

    	return [eid, val, fsize, mode, readOnly, showLineNo, maxLines];
    }

    class Editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			fsize: 2,
    			mode: 3,
    			eid: 0,
    			val: 1,
    			readOnly: 4,
    			showLineNo: 5,
    			maxLines: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Editor",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*eid*/ ctx[0] === undefined && !("eid" in props)) {
    			console.warn("<Editor> was created without expected prop 'eid'");
    		}

    		if (/*val*/ ctx[1] === undefined && !("val" in props)) {
    			console.warn("<Editor> was created without expected prop 'val'");
    		}
    	}

    	get fsize() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fsize(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eid() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eid(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get val() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set val(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readOnly() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readOnly(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showLineNo() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showLineNo(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxLines() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxLines(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let examples  = writable({});
    let runRJQL = writable(false);

    let menu = writable(0);

    /* src\CodeExecutor.svelte generated by Svelte v3.18.1 */
    const file$1 = "src\\CodeExecutor.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (128:4) {#if showRun}
    function create_if_block_2(ctx) {
    	let div;
    	let i;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t = text("\r\n        RUN");
    			attr_dev(i, "class", "fas fa-bolt");
    			add_location(i, file$1, 129, 8, 2667);
    			attr_dev(div, "class", "btn svelte-bht3uy");
    			add_location(div, file$1, 128, 6, 2625);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t);
    			dispose = listen_dev(div, "click", /*run*/ ctx[8], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(128:4) {#if showRun}",
    		ctx
    	});

    	return block;
    }

    // (134:4) {#if result}
    function create_if_block(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let html_tag;
    	let raw_value = (/*result*/ ctx[7].status ? "&#10004;" : "&#10005;") + "";
    	let t1;
    	let t2_value = /*result*/ ctx[7].desc + "";
    	let t2;
    	let div1_class_value;
    	let each_value = /*result*/ ctx[7].qbs;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			t2 = text(t2_value);
    			attr_dev(div0, "class", "errs svelte-bht3uy");
    			add_location(div0, file$1, 135, 8, 2786);
    			html_tag = new HtmlTag(raw_value, t1);
    			attr_dev(div1, "class", div1_class_value = "st " + /*result*/ ctx[7].desc + " svelte-bht3uy");
    			add_location(div1, file$1, 142, 8, 3034);
    			attr_dev(div2, "class", "result svelte-bht3uy");
    			add_location(div2, file$1, 134, 6, 2756);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			html_tag.m(div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*result*/ 128) {
    				each_value = /*result*/ ctx[7].qbs;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*result*/ 128 && raw_value !== (raw_value = (/*result*/ ctx[7].status ? "&#10004;" : "&#10005;") + "")) html_tag.p(raw_value);
    			if (dirty & /*result*/ 128 && t2_value !== (t2_value = /*result*/ ctx[7].desc + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*result*/ 128 && div1_class_value !== (div1_class_value = "st " + /*result*/ ctx[7].desc + " svelte-bht3uy")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(134:4) {#if result}",
    		ctx
    	});

    	return block;
    }

    // (138:10) {#if !qb.status}
    function create_if_block_1(ctx) {
    	let div;
    	let t0_value = /*i*/ ctx[12] + 1 + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = /*qb*/ ctx[10].verb + "";
    	let t2;

    	let t3_value = (/*qb*/ ctx[10].line != -1
    	? "at line " + /*qb*/ ctx[10].line
    	: "") + "";

    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text(". ");
    			t2 = space();
    			t3 = text(t3_value);
    			html_tag = new HtmlTag(raw_value, t2);
    			attr_dev(div, "class", "err svelte-bht3uy");
    			add_location(div, file$1, 138, 12, 2883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			html_tag.m(div);
    			append_dev(div, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*result*/ 128 && raw_value !== (raw_value = /*qb*/ ctx[10].verb + "")) html_tag.p(raw_value);

    			if (dirty & /*result*/ 128 && t3_value !== (t3_value = (/*qb*/ ctx[10].line != -1
    			? "at line " + /*qb*/ ctx[10].line
    			: "") + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(138:10) {#if !qb.status}",
    		ctx
    	});

    	return block;
    }

    // (137:8) {#each result.qbs as qb, i}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = !/*qb*/ ctx[10].status && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*qb*/ ctx[10].status) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(137:8) {#each result.qbs as qb, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div3;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let t4;
    	let current;

    	const editor0 = new Editor({
    			props: {
    				val: /*json*/ ctx[0],
    				eid: /*eid1*/ ctx[3],
    				maxLines: /*maxLines*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const editor1 = new Editor({
    			props: {
    				val: /*_rjql*/ ctx[1],
    				eid: /*eid2*/ ctx[4],
    				maxLines: /*maxLines*/ ctx[2]
    			},
    			$$inline: true
    		});

    	let if_block0 = /*showRun*/ ctx[5] && create_if_block_2(ctx);
    	let if_block1 = /*result*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("Loding Live Editor...");
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			create_component(editor0.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(editor1.$$.fragment);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			set_style(div0, "display", !/*show*/ ctx[6] ? "" : "none");
    			attr_dev(div0, "class", "loader svelte-bht3uy");
    			add_location(div0, file$1, 117, 0, 2263);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$1, 121, 2, 2423);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "position", "relative");
    			add_location(div2, file$1, 124, 2, 2502);
    			attr_dev(div3, "class", "row");
    			set_style(div3, "visibility", /*show*/ ctx[6] ? "" : "hidden");
    			add_location(div3, file$1, 120, 0, 2359);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			mount_component(editor0, div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(editor1, div2, null);
    			append_dev(div2, t3);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t4);
    			if (if_block1) if_block1.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*show*/ 64) {
    				set_style(div0, "display", !/*show*/ ctx[6] ? "" : "none");
    			}

    			const editor0_changes = {};
    			if (dirty & /*json*/ 1) editor0_changes.val = /*json*/ ctx[0];
    			if (dirty & /*eid1*/ 8) editor0_changes.eid = /*eid1*/ ctx[3];
    			if (dirty & /*maxLines*/ 4) editor0_changes.maxLines = /*maxLines*/ ctx[2];
    			editor0.$set(editor0_changes);
    			const editor1_changes = {};
    			if (dirty & /*_rjql*/ 2) editor1_changes.val = /*_rjql*/ ctx[1];
    			if (dirty & /*eid2*/ 16) editor1_changes.eid = /*eid2*/ ctx[4];
    			if (dirty & /*maxLines*/ 4) editor1_changes.maxLines = /*maxLines*/ ctx[2];
    			editor1.$set(editor1_changes);

    			if (/*showRun*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div2, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*result*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*show*/ 64) {
    				set_style(div3, "visibility", /*show*/ ctx[6] ? "" : "hidden");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editor0.$$.fragment, local);
    			transition_in(editor1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editor0.$$.fragment, local);
    			transition_out(editor1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			destroy_component(editor0);
    			destroy_component(editor1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function transformedResult(_r) {
    	var desc = _r.passed ? "passed" : "failed";
    	return { desc, status: _r.passed, qbs: _r.qbs };
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { json } = $$props;
    	let { _rjql } = $$props;
    	let { maxLines = 10 } = $$props;
    	let { eid1 = "edtr-" + new Date().getTime() * Math.random() } = $$props;
    	let { eid2 = "edtr-" + new Date().getTime() * Math.random() } = $$props;
    	let { showRun = true } = $$props;
    	var show = false;
    	var validate = rjql.consolidated;
    	var result;

    	runRJQL.subscribe(() => {
    		try {
    			run();
    		} catch(e) {
    			
    		}
    	});

    	onMount(() => {
    		setTimeout(
    			() => {
    				$$invalidate(6, show = true);
    				run();
    			},
    			300
    		);
    	});

    	function run() {
    		var _response = window[eid1].getSession().getValue();
    		var qry = window[eid2].getSession().getValue();

    		$$invalidate(7, result = (function () {
    			try {
    				var _r = validate(_response, qry);
    				return transformedResult(_r);
    			} catch(e) {
    				return {
    					desc: e.toString(),
    					status: false,
    					qbs: [{ verb: e, line: -1, status: false }]
    				};
    			}
    		})());
    	}

    	const writable_props = ["json", "_rjql", "maxLines", "eid1", "eid2", "showRun"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CodeExecutor> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("json" in $$props) $$invalidate(0, json = $$props.json);
    		if ("_rjql" in $$props) $$invalidate(1, _rjql = $$props._rjql);
    		if ("maxLines" in $$props) $$invalidate(2, maxLines = $$props.maxLines);
    		if ("eid1" in $$props) $$invalidate(3, eid1 = $$props.eid1);
    		if ("eid2" in $$props) $$invalidate(4, eid2 = $$props.eid2);
    		if ("showRun" in $$props) $$invalidate(5, showRun = $$props.showRun);
    	};

    	$$self.$capture_state = () => {
    		return {
    			json,
    			_rjql,
    			maxLines,
    			eid1,
    			eid2,
    			showRun,
    			show,
    			validate,
    			result
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("json" in $$props) $$invalidate(0, json = $$props.json);
    		if ("_rjql" in $$props) $$invalidate(1, _rjql = $$props._rjql);
    		if ("maxLines" in $$props) $$invalidate(2, maxLines = $$props.maxLines);
    		if ("eid1" in $$props) $$invalidate(3, eid1 = $$props.eid1);
    		if ("eid2" in $$props) $$invalidate(4, eid2 = $$props.eid2);
    		if ("showRun" in $$props) $$invalidate(5, showRun = $$props.showRun);
    		if ("show" in $$props) $$invalidate(6, show = $$props.show);
    		if ("validate" in $$props) validate = $$props.validate;
    		if ("result" in $$props) $$invalidate(7, result = $$props.result);
    	};

    	return [json, _rjql, maxLines, eid1, eid2, showRun, show, result, run];
    }

    class CodeExecutor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			json: 0,
    			_rjql: 1,
    			maxLines: 2,
    			eid1: 3,
    			eid2: 4,
    			showRun: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CodeExecutor",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*json*/ ctx[0] === undefined && !("json" in props)) {
    			console.warn("<CodeExecutor> was created without expected prop 'json'");
    		}

    		if (/*_rjql*/ ctx[1] === undefined && !("_rjql" in props)) {
    			console.warn("<CodeExecutor> was created without expected prop '_rjql'");
    		}
    	}

    	get json() {
    		throw new Error("<CodeExecutor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set json(value) {
    		throw new Error("<CodeExecutor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get _rjql() {
    		throw new Error("<CodeExecutor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set _rjql(value) {
    		throw new Error("<CodeExecutor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxLines() {
    		throw new Error("<CodeExecutor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxLines(value) {
    		throw new Error("<CodeExecutor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eid1() {
    		throw new Error("<CodeExecutor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eid1(value) {
    		throw new Error("<CodeExecutor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eid2() {
    		throw new Error("<CodeExecutor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eid2(value) {
    		throw new Error("<CodeExecutor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showRun() {
    		throw new Error("<CodeExecutor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showRun(value) {
    		throw new Error("<CodeExecutor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SingleValues.svelte generated by Svelte v3.18.1 */
    const file$2 = "src\\SingleValues.svelte";

    function create_fragment$2(ctx) {
    	let div0;
    	let t1;
    	let div8;
    	let div1;
    	let t2;
    	let div7;
    	let div6;
    	let div2;
    	let i0;
    	let t3;
    	let br0;
    	let t4;
    	let div3;
    	let t5;
    	let div4;
    	let p0;
    	let t6;
    	let span0;
    	let t8;
    	let span1;
    	let t10;
    	let t11;
    	let div5;
    	let t12;
    	let div17;
    	let div9;
    	let t13;
    	let div10;
    	let t14;
    	let div16;
    	let div15;
    	let div11;
    	let i1;
    	let t15;
    	let br1;
    	let t16;
    	let div12;
    	let t17;
    	let div13;
    	let p1;
    	let t18;
    	let span2;
    	let t20;
    	let span3;
    	let t22;
    	let t23;
    	let div14;
    	let t24;
    	let div28;
    	let div18;
    	let t25;
    	let div19;
    	let t26;
    	let div27;
    	let div26;
    	let div20;
    	let i2;
    	let t27;
    	let br2;
    	let t28;
    	let div21;
    	let t29;
    	let div23;
    	let div22;
    	let t31;
    	let p2;
    	let t32;
    	let span4;
    	let t34;
    	let span5;
    	let t36;
    	let span6;
    	let t38;
    	let t39;
    	let div25;
    	let div24;
    	let i3;
    	let t40;
    	let t41;
    	let p3;
    	let t42;
    	let span7;
    	let t44;
    	let span8;
    	let t46;
    	let br3;
    	let t47;
    	let span9;
    	let t49;
    	let span10;
    	let t51;
    	let current;

    	const codeexecutor0 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].singlevalues.json,
    				_rjql: /*$examples*/ ctx[0].singlevalues.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor1 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].singlevalues1.json,
    				_rjql: /*$examples*/ ctx[0].singlevalues1.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor2 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].singlevalues2.json,
    				_rjql: /*$examples*/ ctx[0].singlevalues2.rjql
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Single Values";
    			t1 = space();
    			div8 = element("div");
    			div1 = element("div");
    			t2 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div2 = element("div");
    			i0 = element("i");
    			t3 = text("\r\n        Example 1\r\n        ");
    			br0 = element("br");
    			t4 = space();
    			div3 = element("div");
    			create_component(codeexecutor0.$$.fragment);
    			t5 = space();
    			div4 = element("div");
    			p0 = element("p");
    			t6 = text("Checks whether the value of the field\r\n          ");
    			span0 = element("span");
    			span0.textContent = "name";
    			t8 = text("\r\n          is equal to\r\n          ");
    			span1 = element("span");
    			span1.textContent = "John";
    			t10 = text("\r\n          .");
    			t11 = space();
    			div5 = element("div");
    			t12 = space();
    			div17 = element("div");
    			div9 = element("div");
    			t13 = space();
    			div10 = element("div");
    			t14 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div11 = element("div");
    			i1 = element("i");
    			t15 = text("\r\n        Example 2\r\n        ");
    			br1 = element("br");
    			t16 = space();
    			div12 = element("div");
    			create_component(codeexecutor1.$$.fragment);
    			t17 = space();
    			div13 = element("div");
    			p1 = element("p");
    			t18 = text("Checks whether the value of the field\r\n          ");
    			span2 = element("span");
    			span2.textContent = "name";
    			t20 = text("\r\n          is equal to\r\n          ");
    			span3 = element("span");
    			span3.textContent = "John";
    			t22 = text("\r\n          .");
    			t23 = space();
    			div14 = element("div");
    			t24 = space();
    			div28 = element("div");
    			div18 = element("div");
    			t25 = space();
    			div19 = element("div");
    			t26 = space();
    			div27 = element("div");
    			div26 = element("div");
    			div20 = element("div");
    			i2 = element("i");
    			t27 = text("\r\n        Example 3\r\n        ");
    			br2 = element("br");
    			t28 = space();
    			div21 = element("div");
    			create_component(codeexecutor2.$$.fragment);
    			t29 = space();
    			div23 = element("div");
    			div22 = element("div");
    			div22.textContent = "Explanation";
    			t31 = space();
    			p2 = element("p");
    			t32 = text("Checks whether the value of the field\r\n          ");
    			span4 = element("span");
    			span4.textContent = "city";
    			t34 = text("\r\n          inside\r\n          ");
    			span5 = element("span");
    			span5.textContent = "address";
    			t36 = text("\r\n          is equal to\r\n          ");
    			span6 = element("span");
    			span6.textContent = "Dallas";
    			t38 = text("\r\n          .");
    			t39 = space();
    			div25 = element("div");
    			div24 = element("div");
    			i3 = element("i");
    			t40 = text("\r\n          NOTE");
    			t41 = space();
    			p3 = element("p");
    			t42 = text("Don't confuse\r\n          ");
    			span7 = element("span");
    			span7.textContent = "'>'";
    			t44 = text("\r\n          operator with\r\n          ");
    			span8 = element("span");
    			span8.textContent = ">";
    			t46 = text("\r\n          symbol which is uded in above example.\r\n          ");
    			br3 = element("br");
    			t47 = text("\r\n          The symbol used in the above example is for traversing into\r\n          ");
    			span9 = element("span");
    			span9.textContent = "city";
    			t49 = text("\r\n          which is inside\r\n          ");
    			span10 = element("span");
    			span10.textContent = "address";
    			t51 = text("\r\n          .");
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$2, 10, 0, 180);
    			attr_dev(div1, "class", "discription");
    			add_location(div1, file$2, 14, 2, 263);
    			attr_dev(i0, "class", "fas fa-check");
    			add_location(i0, file$2, 18, 8, 380);
    			add_location(br0, file$2, 20, 8, 435);
    			attr_dev(div2, "class", "title");
    			add_location(div2, file$2, 17, 6, 351);
    			attr_dev(div3, "class", "ce");
    			add_location(div3, file$2, 22, 6, 463);
    			attr_dev(span0, "class", "span_style");
    			add_location(span0, file$2, 30, 10, 719);
    			attr_dev(span1, "class", "span_style");
    			add_location(span1, file$2, 32, 10, 790);
    			add_location(p0, file$2, 28, 8, 655);
    			attr_dev(div4, "class", "explanation");
    			add_location(div4, file$2, 27, 6, 620);
    			attr_dev(div5, "class", "note");
    			add_location(div5, file$2, 36, 6, 875);
    			attr_dev(div6, "class", "example");
    			add_location(div6, file$2, 16, 4, 322);
    			attr_dev(div7, "class", "examples");
    			add_location(div7, file$2, 15, 2, 294);
    			attr_dev(div8, "class", "Example_block first");
    			add_location(div8, file$2, 12, 0, 224);
    			attr_dev(div9, "class", "heading");
    			add_location(div9, file$2, 43, 2, 962);
    			attr_dev(div10, "class", "discription");
    			add_location(div10, file$2, 44, 2, 989);
    			attr_dev(i1, "class", "fas fa-check");
    			add_location(i1, file$2, 48, 8, 1106);
    			add_location(br1, file$2, 50, 8, 1161);
    			attr_dev(div11, "class", "title");
    			add_location(div11, file$2, 47, 6, 1077);
    			attr_dev(div12, "class", "ce");
    			add_location(div12, file$2, 52, 6, 1189);
    			attr_dev(span2, "class", "span_style");
    			add_location(span2, file$2, 60, 10, 1447);
    			attr_dev(span3, "class", "span_style");
    			add_location(span3, file$2, 62, 10, 1518);
    			add_location(p1, file$2, 58, 8, 1383);
    			attr_dev(div13, "class", "explanation");
    			add_location(div13, file$2, 57, 6, 1348);
    			attr_dev(div14, "class", "note");
    			add_location(div14, file$2, 66, 6, 1603);
    			attr_dev(div15, "class", "example");
    			add_location(div15, file$2, 46, 4, 1048);
    			attr_dev(div16, "class", "examples");
    			add_location(div16, file$2, 45, 2, 1020);
    			attr_dev(div17, "class", "Example_block");
    			add_location(div17, file$2, 42, 0, 931);
    			attr_dev(div18, "class", "heading");
    			add_location(div18, file$2, 73, 2, 1690);
    			attr_dev(div19, "class", "discription");
    			add_location(div19, file$2, 74, 2, 1717);
    			attr_dev(i2, "class", "fas fa-check");
    			add_location(i2, file$2, 78, 8, 1834);
    			add_location(br2, file$2, 80, 8, 1889);
    			attr_dev(div20, "class", "title");
    			add_location(div20, file$2, 77, 6, 1805);
    			attr_dev(div21, "class", "ce");
    			add_location(div21, file$2, 82, 6, 1917);
    			attr_dev(div22, "class", "explanation_style");
    			add_location(div22, file$2, 88, 8, 2111);
    			attr_dev(span4, "class", "span_style");
    			add_location(span4, file$2, 91, 10, 2233);
    			attr_dev(span5, "class", "span_style");
    			add_location(span5, file$2, 93, 10, 2299);
    			set_style(span6, "color", "blue");
    			add_location(span6, file$2, 95, 10, 2373);
    			add_location(p2, file$2, 89, 8, 2169);
    			attr_dev(div23, "class", "explanation");
    			add_location(div23, file$2, 87, 6, 2076);
    			attr_dev(i3, "class", "fas fa-asterisk");
    			add_location(i3, file$2, 101, 10, 2524);
    			attr_dev(div24, "class", "note_style");
    			add_location(div24, file$2, 100, 8, 2488);
    			attr_dev(span7, "class", "span_style");
    			add_location(span7, file$2, 107, 10, 2637);
    			attr_dev(span8, "class", "span_style");
    			add_location(span8, file$2, 109, 10, 2709);
    			add_location(br3, file$2, 111, 10, 2804);
    			attr_dev(span9, "class", "span_style");
    			add_location(span9, file$2, 113, 10, 2893);
    			attr_dev(span10, "class", "span_style");
    			add_location(span10, file$2, 115, 10, 2968);
    			add_location(p3, file$2, 105, 8, 2597);
    			attr_dev(div25, "class", "note");
    			add_location(div25, file$2, 99, 6, 2460);
    			attr_dev(div26, "class", "example");
    			add_location(div26, file$2, 76, 4, 1776);
    			attr_dev(div27, "class", "examples");
    			add_location(div27, file$2, 75, 2, 1748);
    			attr_dev(div28, "class", "Example_block");
    			add_location(div28, file$2, 72, 0, 1659);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div8, t2);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div2, i0);
    			append_dev(div2, t3);
    			append_dev(div2, br0);
    			append_dev(div6, t4);
    			append_dev(div6, div3);
    			mount_component(codeexecutor0, div3, null);
    			append_dev(div6, t5);
    			append_dev(div6, div4);
    			append_dev(div4, p0);
    			append_dev(p0, t6);
    			append_dev(p0, span0);
    			append_dev(p0, t8);
    			append_dev(p0, span1);
    			append_dev(p0, t10);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div9);
    			append_dev(div17, t13);
    			append_dev(div17, div10);
    			append_dev(div17, t14);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div11);
    			append_dev(div11, i1);
    			append_dev(div11, t15);
    			append_dev(div11, br1);
    			append_dev(div15, t16);
    			append_dev(div15, div12);
    			mount_component(codeexecutor1, div12, null);
    			append_dev(div15, t17);
    			append_dev(div15, div13);
    			append_dev(div13, p1);
    			append_dev(p1, t18);
    			append_dev(p1, span2);
    			append_dev(p1, t20);
    			append_dev(p1, span3);
    			append_dev(p1, t22);
    			append_dev(div15, t23);
    			append_dev(div15, div14);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, div28, anchor);
    			append_dev(div28, div18);
    			append_dev(div28, t25);
    			append_dev(div28, div19);
    			append_dev(div28, t26);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div26, div20);
    			append_dev(div20, i2);
    			append_dev(div20, t27);
    			append_dev(div20, br2);
    			append_dev(div26, t28);
    			append_dev(div26, div21);
    			mount_component(codeexecutor2, div21, null);
    			append_dev(div26, t29);
    			append_dev(div26, div23);
    			append_dev(div23, div22);
    			append_dev(div23, t31);
    			append_dev(div23, p2);
    			append_dev(p2, t32);
    			append_dev(p2, span4);
    			append_dev(p2, t34);
    			append_dev(p2, span5);
    			append_dev(p2, t36);
    			append_dev(p2, span6);
    			append_dev(p2, t38);
    			append_dev(div26, t39);
    			append_dev(div26, div25);
    			append_dev(div25, div24);
    			append_dev(div24, i3);
    			append_dev(div24, t40);
    			append_dev(div25, t41);
    			append_dev(div25, p3);
    			append_dev(p3, t42);
    			append_dev(p3, span7);
    			append_dev(p3, t44);
    			append_dev(p3, span8);
    			append_dev(p3, t46);
    			append_dev(p3, br3);
    			append_dev(p3, t47);
    			append_dev(p3, span9);
    			append_dev(p3, t49);
    			append_dev(p3, span10);
    			append_dev(p3, t51);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const codeexecutor0_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes.json = /*$examples*/ ctx[0].singlevalues.json;
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes._rjql = /*$examples*/ ctx[0].singlevalues.rjql;
    			codeexecutor0.$set(codeexecutor0_changes);
    			const codeexecutor1_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes.json = /*$examples*/ ctx[0].singlevalues1.json;
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes._rjql = /*$examples*/ ctx[0].singlevalues1.rjql;
    			codeexecutor1.$set(codeexecutor1_changes);
    			const codeexecutor2_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor2_changes.json = /*$examples*/ ctx[0].singlevalues2.json;
    			if (dirty & /*$examples*/ 1) codeexecutor2_changes._rjql = /*$examples*/ ctx[0].singlevalues2.rjql;
    			codeexecutor2.$set(codeexecutor2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(codeexecutor0.$$.fragment, local);
    			transition_in(codeexecutor1.$$.fragment, local);
    			transition_in(codeexecutor2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(codeexecutor0.$$.fragment, local);
    			transition_out(codeexecutor1.$$.fragment, local);
    			transition_out(codeexecutor2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div8);
    			destroy_component(codeexecutor0);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div17);
    			destroy_component(codeexecutor1);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(div28);
    			destroy_component(codeexecutor2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $examples;
    	validate_store(examples, "examples");
    	component_subscribe($$self, examples, $$value => $$invalidate(0, $examples = $$value));

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$examples" in $$props) examples.set($examples = $$props.$examples);
    	};

    	return [$examples];
    }

    class SingleValues extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SingleValues",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Operators.svelte generated by Svelte v3.18.1 */
    const file$3 = "src\\Operators.svelte";

    function create_fragment$3(ctx) {
    	let div0;
    	let t1;
    	let div3;
    	let div2;
    	let div1;
    	let t3;
    	let div4;
    	let table;
    	let tr0;
    	let th0;
    	let t5;
    	let th1;
    	let t7;
    	let tr1;
    	let td0;
    	let t9;
    	let td1;
    	let t11;
    	let tr2;
    	let td2;
    	let t13;
    	let td3;
    	let t15;
    	let tr3;
    	let td4;
    	let t17;
    	let td5;
    	let t19;
    	let tr4;
    	let td6;
    	let t21;
    	let td7;
    	let t23;
    	let tr5;
    	let td8;
    	let t25;
    	let td9;
    	let t27;
    	let tr6;
    	let td10;
    	let t29;
    	let td11;
    	let t31;
    	let tr7;
    	let td12;
    	let t33;
    	let td13;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Operators";
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "Operators are standard with any popular programming language.";
    			t3 = space();
    			div4 = element("div");
    			table = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Operators";
    			t5 = space();
    			th1 = element("th");
    			th1.textContent = "Description";
    			t7 = space();
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "=";
    			t9 = space();
    			td1 = element("td");
    			td1.textContent = "Operator validates whether the value of the left hand variable is equal\r\n        to the right hand value.";
    			t11 = space();
    			tr2 = element("tr");
    			td2 = element("td");
    			td2.textContent = ">";
    			t13 = space();
    			td3 = element("td");
    			td3.textContent = "Operator validates whether the value of the left hand variable is\r\n        greater than right hand value.";
    			t15 = space();
    			tr3 = element("tr");
    			td4 = element("td");
    			td4.textContent = "<";
    			t17 = space();
    			td5 = element("td");
    			td5.textContent = "Operator validates whether the value of the left hand variable is\r\n        smaller than to the right hand value.";
    			t19 = space();
    			tr4 = element("tr");
    			td6 = element("td");
    			td6.textContent = ">=";
    			t21 = space();
    			td7 = element("td");
    			td7.textContent = "Operator validates whether the value of the left hand variable is\r\n        greater than or equal to the right hand value.";
    			t23 = space();
    			tr5 = element("tr");
    			td8 = element("td");
    			td8.textContent = `${/*l*/ ctx[0]}`;
    			t25 = space();
    			td9 = element("td");
    			td9.textContent = "Operator validates whether the value of the left hand variable is\r\n        smaller than or equal to the right hand value.";
    			t27 = space();
    			tr6 = element("tr");
    			td10 = element("td");
    			td10.textContent = `${/*n*/ ctx[1]}`;
    			t29 = space();
    			td11 = element("td");
    			td11.textContent = "Operator validates whether the value of the left hand variable is not\r\n        equal to the right hand value.";
    			t31 = space();
    			tr7 = element("tr");
    			td12 = element("td");
    			td12.textContent = "~";
    			t33 = space();
    			td13 = element("td");
    			td13.textContent = "Operator checks for the substring in the original string.";
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$3, 12, 0, 225);
    			set_style(div1, "text-align", "center");
    			set_style(div1, "margin-top", "10%");
    			set_style(div1, "font-size", "1.3rem");
    			add_location(div1, file$3, 15, 4, 315);
    			attr_dev(div2, "class", "");
    			add_location(div2, file$3, 14, 2, 295);
    			attr_dev(div3, "class", "Example_block ");
    			add_location(div3, file$3, 13, 0, 263);
    			add_location(th0, file$3, 22, 6, 546);
    			add_location(th1, file$3, 23, 6, 572);
    			add_location(tr0, file$3, 21, 4, 534);
    			add_location(td0, file$3, 26, 6, 621);
    			add_location(td1, file$3, 27, 6, 639);
    			add_location(tr1, file$3, 25, 4, 609);
    			add_location(td2, file$3, 34, 6, 802);
    			add_location(td3, file$3, 35, 6, 822);
    			add_location(tr2, file$3, 33, 4, 790);
    			add_location(td4, file$3, 42, 6, 985);
    			add_location(td5, file$3, 43, 6, 1005);
    			add_location(tr3, file$3, 41, 4, 973);
    			add_location(td6, file$3, 50, 6, 1175);
    			add_location(td7, file$3, 51, 6, 1194);
    			add_location(tr4, file$3, 49, 4, 1163);
    			add_location(td8, file$3, 58, 6, 1373);
    			add_location(td9, file$3, 59, 6, 1393);
    			add_location(tr5, file$3, 57, 4, 1361);
    			add_location(td10, file$3, 66, 6, 1572);
    			add_location(td11, file$3, 67, 6, 1592);
    			add_location(tr6, file$3, 65, 4, 1560);
    			add_location(td12, file$3, 74, 6, 1759);
    			add_location(td13, file$3, 75, 6, 1777);
    			add_location(tr7, file$3, 73, 4, 1747);
    			attr_dev(table, "id", "operators");
    			add_location(table, file$3, 20, 2, 506);
    			attr_dev(div4, "class", "operators first");
    			add_location(div4, file$3, 18, 0, 471);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, table);
    			append_dev(table, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t5);
    			append_dev(tr0, th1);
    			append_dev(table, t7);
    			append_dev(table, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t9);
    			append_dev(tr1, td1);
    			append_dev(table, t11);
    			append_dev(table, tr2);
    			append_dev(tr2, td2);
    			append_dev(tr2, t13);
    			append_dev(tr2, td3);
    			append_dev(table, t15);
    			append_dev(table, tr3);
    			append_dev(tr3, td4);
    			append_dev(tr3, t17);
    			append_dev(tr3, td5);
    			append_dev(table, t19);
    			append_dev(table, tr4);
    			append_dev(tr4, td6);
    			append_dev(tr4, t21);
    			append_dev(tr4, td7);
    			append_dev(table, t23);
    			append_dev(table, tr5);
    			append_dev(tr5, td8);
    			append_dev(tr5, t25);
    			append_dev(tr5, td9);
    			append_dev(table, t27);
    			append_dev(table, tr6);
    			append_dev(tr6, td10);
    			append_dev(tr6, t29);
    			append_dev(tr6, td11);
    			append_dev(table, t31);
    			append_dev(table, tr7);
    			append_dev(tr7, td12);
    			append_dev(tr7, t33);
    			append_dev(tr7, td13);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self) {
    	onMount(() => {
    		
    	});

    	var l = "<=";
    	var n = "<>";

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("l" in $$props) $$invalidate(0, l = $$props.l);
    		if ("n" in $$props) $$invalidate(1, n = $$props.n);
    	};

    	return [l, n];
    }

    class Operators extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Operators",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Arrays.svelte generated by Svelte v3.18.1 */
    const file$4 = "src\\Arrays.svelte";

    function create_fragment$4(ctx) {
    	let div0;
    	let t1;
    	let div9;
    	let div1;
    	let p0;
    	let t3;
    	let div8;
    	let div5;
    	let div2;
    	let i0;
    	let t4;
    	let t5;
    	let div3;
    	let t6;
    	let div4;
    	let p1;
    	let t8;
    	let p2;
    	let t9;
    	let br0;
    	let t10;
    	let br1;
    	let t11;
    	let div7;
    	let div6;
    	let i1;
    	let t12;
    	let t13;
    	let p3;
    	let t14;
    	let p4;
    	let t15;
    	let span0;
    	let t17;
    	let t18;
    	let t19;
    	let div18;
    	let div10;
    	let p5;
    	let t21;
    	let div17;
    	let div14;
    	let div11;
    	let i2;
    	let t22;
    	let t23;
    	let div12;
    	let t24;
    	let div13;
    	let p6;
    	let t26;
    	let p7;
    	let t28;
    	let p8;
    	let t29;
    	let span1;
    	let t30;
    	let span2;
    	let t32;
    	let span3;
    	let t34;
    	let br2;
    	let t35;
    	let span4;
    	let t36;
    	let span5;
    	let t38;
    	let span6;
    	let t40;
    	let br3;
    	let t41;
    	let span7;
    	let t43;
    	let span8;
    	let t45;
    	let span9;
    	let t47;
    	let br4;
    	let t48;
    	let span10;
    	let t50;
    	let span11;
    	let t52;
    	let span12;
    	let t54;
    	let span13;
    	let t56;
    	let span14;
    	let t58;
    	let br5;
    	let t59;
    	let span15;
    	let t61;
    	let span16;
    	let t63;
    	let t64;
    	let div16;
    	let div15;
    	let i3;
    	let t65;
    	let t66;
    	let p9;
    	let t67;
    	let p10;
    	let t68;
    	let span17;
    	let t70;
    	let t71;
    	let current;

    	const codeexecutor0 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].arrays.json,
    				_rjql: /*$examples*/ ctx[0].arrays.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor1 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].arrays1.json,
    				_rjql: /*$examples*/ ctx[0].arrays1.rjql
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Arrays";
    			t1 = space();
    			div9 = element("div");
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Array of primitives";
    			t3 = space();
    			div8 = element("div");
    			div5 = element("div");
    			div2 = element("div");
    			i0 = element("i");
    			t4 = text("\r\n        Example:");
    			t5 = space();
    			div3 = element("div");
    			create_component(codeexecutor0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			p1 = element("p");
    			p1.textContent = "Explanation";
    			t8 = space();
    			p2 = element("p");
    			t9 = text("It is the collection of homogenious data .\r\n        ");
    			br0 = element("br");
    			t10 = text("\r\n        Array values can be of type string, number, object, array, boolean or\r\n        null.\r\n        ");
    			br1 = element("br");
    			t11 = space();
    			div7 = element("div");
    			div6 = element("div");
    			i1 = element("i");
    			t12 = text("\r\n        NOTE");
    			t13 = space();
    			p3 = element("p");
    			t14 = space();
    			p4 = element("p");
    			t15 = text("Query can alse be written as\r\n        ");
    			span0 = element("span");
    			span0.textContent = "cars ~ \"Ford\"";
    			t17 = text("\r\n        .");
    			t18 = text("\r\n      .");
    			t19 = space();
    			div18 = element("div");
    			div10 = element("div");
    			p5 = element("p");
    			p5.textContent = "Array of nested objects";
    			t21 = space();
    			div17 = element("div");
    			div14 = element("div");
    			div11 = element("div");
    			i2 = element("i");
    			t22 = text("\r\n        Example:");
    			t23 = space();
    			div12 = element("div");
    			create_component(codeexecutor1.$$.fragment);
    			t24 = space();
    			div13 = element("div");
    			p6 = element("p");
    			p6.textContent = "Explanation";
    			t26 = space();
    			p7 = element("p");
    			p7.textContent = "We can have array inside other array.";
    			t28 = space();
    			p8 = element("p");
    			t29 = text("If we need to access the array\r\n        ");
    			span1 = element("span");
    			t30 = text("\r\n        , first we need to traverse the object\r\n        ");
    			span2 = element("span");
    			span2.textContent = "data";
    			t32 = text("\r\n        and then we need to go to the array\r\n        ");
    			span3 = element("span");
    			span3.textContent = "cars";
    			t34 = text("\r\n        .\r\n        ");
    			br2 = element("br");
    			t35 = text("\r\n        The symbol\r\n        ");
    			span4 = element("span");
    			t36 = text("\r\n        is used to point to the array\r\n        ");
    			span5 = element("span");
    			span5.textContent = "cars";
    			t38 = text("\r\n        which is inside the object\r\n        ");
    			span6 = element("span");
    			span6.textContent = "data";
    			t40 = text("\r\n        .\r\n        ");
    			br3 = element("br");
    			t41 = text("\r\n        To validate some fields inside the array\r\n        ");
    			span7 = element("span");
    			span7.textContent = "cars";
    			t43 = text("\r\n        then you need to traverse the array\r\n        ");
    			span8 = element("span");
    			span8.textContent = "cars";
    			t45 = text("\r\n        . So, we need to go inside the array. To do this we need to use colon (\r\n        ");
    			span9 = element("span");
    			span9.textContent = ":";
    			t47 = text("\r\n        ).\r\n        ");
    			br4 = element("br");
    			t48 = text("\r\n        The symbol\r\n        ");
    			span10 = element("span");
    			span10.textContent = ":";
    			t50 = text("\r\n        is used if we need a nested query. Checking whether the field\r\n        ");
    			span11 = element("span");
    			span11.textContent = "model";
    			t52 = text("\r\n        is equal to the value\r\n        ");
    			span12 = element("span");
    			span12.textContent = "Leaf Plus";
    			t54 = text("\r\n        where\r\n        ");
    			span13 = element("span");
    			span13.textContent = "company";
    			t56 = text("\r\n        is equal to\r\n        ");
    			span14 = element("span");
    			span14.textContent = "Nissan";
    			t58 = text("\r\n        .\r\n        ");
    			br5 = element("br");
    			t59 = text("\r\n        If it is\r\n        ");
    			span15 = element("span");
    			span15.textContent = "Nissan";
    			t61 = text("\r\n        then it will go inside property to check whether the model is\r\n        ");
    			span16 = element("span");
    			span16.textContent = "Leaf Plus";
    			t63 = text("\r\n        or not.");
    			t64 = space();
    			div16 = element("div");
    			div15 = element("div");
    			i3 = element("i");
    			t65 = text("\r\n        NOTE");
    			t66 = space();
    			p9 = element("p");
    			t67 = space();
    			p10 = element("p");
    			t68 = text("Query can alse be written as\r\n        ");
    			span17 = element("span");
    			span17.textContent = "cars ~ \"Ford\"";
    			t70 = text("\r\n        .");
    			t71 = text("\r\n      .");
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$4, 10, 0, 180);
    			add_location(p0, file$4, 14, 4, 281);
    			attr_dev(div1, "class", "heading");
    			add_location(div1, file$4, 13, 2, 254);
    			attr_dev(i0, "class", "fas fa-check");
    			add_location(i0, file$4, 19, 8, 407);
    			attr_dev(div2, "class", "title");
    			add_location(div2, file$4, 18, 6, 378);
    			attr_dev(div3, "class", "ce");
    			add_location(div3, file$4, 22, 6, 473);
    			attr_dev(p1, "class", "title");
    			add_location(p1, file$4, 28, 8, 653);
    			attr_dev(div4, "class", "explanation");
    			add_location(div4, file$4, 27, 6, 618);
    			add_location(br0, file$4, 36, 8, 804);
    			add_location(br1, file$4, 39, 8, 914);
    			add_location(p2, file$4, 34, 6, 739);
    			attr_dev(div5, "class", "example");
    			add_location(div5, file$4, 17, 4, 349);
    			attr_dev(i1, "class", "fas fa-asterisk");
    			add_location(i1, file$4, 44, 8, 1010);
    			attr_dev(div6, "class", "note_style");
    			add_location(div6, file$4, 43, 6, 976);
    			add_location(p3, file$4, 47, 6, 1075);
    			set_style(span0, "color", "blue");
    			add_location(span0, file$4, 50, 8, 1139);
    			add_location(p4, file$4, 48, 6, 1088);
    			attr_dev(div7, "class", "note");
    			add_location(div7, file$4, 42, 4, 950);
    			attr_dev(div8, "class", "examples");
    			add_location(div8, file$4, 16, 2, 321);
    			attr_dev(div9, "class", "Example_block first");
    			add_location(div9, file$4, 12, 0, 217);
    			add_location(p5, file$4, 61, 4, 1310);
    			attr_dev(div10, "class", "heading");
    			add_location(div10, file$4, 60, 2, 1283);
    			attr_dev(i2, "class", "fas fa-check");
    			add_location(i2, file$4, 67, 8, 1442);
    			attr_dev(div11, "class", "title");
    			add_location(div11, file$4, 66, 6, 1413);
    			attr_dev(div12, "class", "ce");
    			add_location(div12, file$4, 70, 6, 1508);
    			attr_dev(p6, "class", "title");
    			add_location(p6, file$4, 76, 8, 1690);
    			attr_dev(div13, "class", "explanation");
    			add_location(div13, file$4, 75, 6, 1655);
    			add_location(p7, file$4, 82, 6, 1776);
    			attr_dev(span1, "class", "span_style");
    			add_location(span1, file$4, 86, 8, 1883);
    			attr_dev(span2, "class", "span_style");
    			add_location(span2, file$4, 88, 8, 1968);
    			attr_dev(span3, "class", "span_style");
    			add_location(span3, file$4, 90, 8, 2059);
    			add_location(br2, file$4, 92, 8, 2116);
    			attr_dev(span4, "class", "span_style");
    			add_location(span4, file$4, 94, 8, 2152);
    			attr_dev(span5, "class", "span_style");
    			add_location(span5, file$4, 96, 8, 2228);
    			attr_dev(span6, "class", "span_style");
    			add_location(span6, file$4, 98, 8, 2310);
    			add_location(br3, file$4, 100, 8, 2367);
    			attr_dev(span7, "class", "span_style");
    			add_location(span7, file$4, 102, 8, 2433);
    			attr_dev(span8, "class", "span_style");
    			add_location(span8, file$4, 104, 8, 2524);
    			attr_dev(span9, "class", "span_style");
    			add_location(span9, file$4, 106, 8, 2651);
    			add_location(br4, file$4, 108, 8, 2706);
    			attr_dev(span10, "class", "span_style");
    			add_location(span10, file$4, 110, 8, 2742);
    			attr_dev(span11, "class", "span_style");
    			add_location(span11, file$4, 112, 8, 2856);
    			attr_dev(span12, "class", "span_style");
    			add_location(span12, file$4, 114, 8, 2934);
    			attr_dev(span13, "class", "span_style");
    			add_location(span13, file$4, 116, 8, 3000);
    			attr_dev(span14, "class", "span_style");
    			add_location(span14, file$4, 118, 8, 3070);
    			add_location(br5, file$4, 120, 8, 3129);
    			attr_dev(span15, "class", "span_style");
    			add_location(span15, file$4, 122, 8, 3163);
    			attr_dev(span16, "class", "span_style");
    			add_location(span16, file$4, 124, 8, 3282);
    			add_location(p8, file$4, 84, 6, 1830);
    			attr_dev(div14, "class", "example");
    			add_location(div14, file$4, 65, 4, 1384);
    			attr_dev(i3, "class", "fas fa-asterisk");
    			add_location(i3, file$4, 131, 8, 3432);
    			attr_dev(div15, "class", "note_style");
    			add_location(div15, file$4, 130, 6, 3398);
    			add_location(p9, file$4, 134, 6, 3497);
    			attr_dev(span17, "class", "span_style");
    			add_location(span17, file$4, 137, 8, 3561);
    			add_location(p10, file$4, 135, 6, 3510);
    			attr_dev(div16, "class", "note");
    			add_location(div16, file$4, 129, 4, 3372);
    			attr_dev(div17, "class", "examples");
    			add_location(div17, file$4, 64, 2, 1356);
    			attr_dev(div18, "class", "Example_block");
    			add_location(div18, file$4, 58, 0, 1250);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div1);
    			append_dev(div1, p0);
    			append_dev(div9, t3);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div5, div2);
    			append_dev(div2, i0);
    			append_dev(div2, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			mount_component(codeexecutor0, div3, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, p1);
    			append_dev(div5, t8);
    			append_dev(div5, p2);
    			append_dev(p2, t9);
    			append_dev(p2, br0);
    			append_dev(p2, t10);
    			append_dev(p2, br1);
    			append_dev(div8, t11);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, i1);
    			append_dev(div6, t12);
    			append_dev(div7, t13);
    			append_dev(div7, p3);
    			append_dev(div7, t14);
    			append_dev(div7, p4);
    			append_dev(p4, t15);
    			append_dev(p4, span0);
    			append_dev(p4, t17);
    			append_dev(div7, t18);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div18, anchor);
    			append_dev(div18, div10);
    			append_dev(div10, p5);
    			append_dev(div18, t21);
    			append_dev(div18, div17);
    			append_dev(div17, div14);
    			append_dev(div14, div11);
    			append_dev(div11, i2);
    			append_dev(div11, t22);
    			append_dev(div14, t23);
    			append_dev(div14, div12);
    			mount_component(codeexecutor1, div12, null);
    			append_dev(div14, t24);
    			append_dev(div14, div13);
    			append_dev(div13, p6);
    			append_dev(div14, t26);
    			append_dev(div14, p7);
    			append_dev(div14, t28);
    			append_dev(div14, p8);
    			append_dev(p8, t29);
    			append_dev(p8, span1);
    			append_dev(p8, t30);
    			append_dev(p8, span2);
    			append_dev(p8, t32);
    			append_dev(p8, span3);
    			append_dev(p8, t34);
    			append_dev(p8, br2);
    			append_dev(p8, t35);
    			append_dev(p8, span4);
    			append_dev(p8, t36);
    			append_dev(p8, span5);
    			append_dev(p8, t38);
    			append_dev(p8, span6);
    			append_dev(p8, t40);
    			append_dev(p8, br3);
    			append_dev(p8, t41);
    			append_dev(p8, span7);
    			append_dev(p8, t43);
    			append_dev(p8, span8);
    			append_dev(p8, t45);
    			append_dev(p8, span9);
    			append_dev(p8, t47);
    			append_dev(p8, br4);
    			append_dev(p8, t48);
    			append_dev(p8, span10);
    			append_dev(p8, t50);
    			append_dev(p8, span11);
    			append_dev(p8, t52);
    			append_dev(p8, span12);
    			append_dev(p8, t54);
    			append_dev(p8, span13);
    			append_dev(p8, t56);
    			append_dev(p8, span14);
    			append_dev(p8, t58);
    			append_dev(p8, br5);
    			append_dev(p8, t59);
    			append_dev(p8, span15);
    			append_dev(p8, t61);
    			append_dev(p8, span16);
    			append_dev(p8, t63);
    			append_dev(div17, t64);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, i3);
    			append_dev(div15, t65);
    			append_dev(div16, t66);
    			append_dev(div16, p9);
    			append_dev(div16, t67);
    			append_dev(div16, p10);
    			append_dev(p10, t68);
    			append_dev(p10, span17);
    			append_dev(p10, t70);
    			append_dev(div16, t71);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const codeexecutor0_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes.json = /*$examples*/ ctx[0].arrays.json;
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes._rjql = /*$examples*/ ctx[0].arrays.rjql;
    			codeexecutor0.$set(codeexecutor0_changes);
    			const codeexecutor1_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes.json = /*$examples*/ ctx[0].arrays1.json;
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes._rjql = /*$examples*/ ctx[0].arrays1.rjql;
    			codeexecutor1.$set(codeexecutor1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(codeexecutor0.$$.fragment, local);
    			transition_in(codeexecutor1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(codeexecutor0.$$.fragment, local);
    			transition_out(codeexecutor1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div9);
    			destroy_component(codeexecutor0);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div18);
    			destroy_component(codeexecutor1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $examples;
    	validate_store(examples, "examples");
    	component_subscribe($$self, examples, $$value => $$invalidate(0, $examples = $$value));

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$examples" in $$props) examples.set($examples = $$props.$examples);
    	};

    	return [$examples];
    }

    class Arrays extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrays",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\Repl.svelte generated by Svelte v3.18.1 */
    const file$5 = "src\\Repl.svelte";

    // (116:2) {#if showEditor}
    function create_if_block$1(ctx) {
    	let current;

    	const codeexecutor = new CodeExecutor({
    			props: {
    				json: /*json*/ ctx[2],
    				_rjql: /*rjql*/ ctx[3],
    				maxLines: "30"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(codeexecutor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(codeexecutor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const codeexecutor_changes = {};
    			if (dirty & /*json*/ 4) codeexecutor_changes.json = /*json*/ ctx[2];
    			if (dirty & /*rjql*/ 8) codeexecutor_changes._rjql = /*rjql*/ ctx[3];
    			codeexecutor.$set(codeexecutor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(codeexecutor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(codeexecutor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(codeexecutor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(116:2) {#if showEditor}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div0;
    	let t1;
    	let div4;
    	let div3;
    	let div1;
    	let t2;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let t6;
    	let div2;
    	let t7;
    	let t8;
    	let div5;
    	let current;
    	let dispose;
    	let if_block = /*showEditor*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "REPL";
    			t1 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			t2 = text("Select Dataset\r\n      ");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Arrays";
    			option1 = element("option");
    			option1.textContent = "Aggregation";
    			option2 = element("option");
    			option2.textContent = "Query Variable";
    			t6 = space();
    			div2 = element("div");
    			t7 = space();
    			if (if_block) if_block.c();
    			t8 = space();
    			div5 = element("div");
    			div5.textContent = "Try out RJQL with your data right here in the browser.";
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$5, 101, 0, 2255);
    			option0.__value = "0";
    			option0.value = option0.__value;
    			add_location(option0, file$5, 108, 8, 2479);
    			option1.__value = "1";
    			option1.value = option1.__value;
    			add_location(option1, file$5, 109, 8, 2522);
    			option2.__value = "2";
    			option2.value = option2.__value;
    			add_location(option2, file$5, 110, 8, 2570);
    			if (/*index*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[14].call(select));
    			add_location(select, file$5, 107, 6, 2423);
    			attr_dev(div1, "class", "col");
    			set_style(div1, "text-align", "left");
    			add_location(div1, file$5, 105, 4, 2350);
    			attr_dev(div2, "class", "col");
    			set_style(div2, "position", "relative");
    			add_location(div2, file$5, 113, 4, 2646);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$5, 104, 2, 2327);
    			attr_dev(div4, "class", "Example_block first");
    			add_location(div4, file$5, 103, 0, 2290);
    			attr_dev(div5, "class", "Example_block");
    			set_style(div5, "margin-top", "45px");
    			set_style(div5, "color", "#9d9c9c");
    			set_style(div5, "font-family", "monospace");
    			add_location(div5, file$5, 119, 0, 2798);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div1, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			select_option(select, /*index*/ ctx[0]);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div4, t7);
    			if (if_block) if_block.m(div4, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div5, anchor);
    			current = true;

    			dispose = [
    				listen_dev(select, "change", /*select_change_handler*/ ctx[14]),
    				listen_dev(select, "change", /*update*/ ctx[4], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*index*/ 1) {
    				select_option(select, /*index*/ ctx[0]);
    			}

    			if (/*showEditor*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div4, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div5);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $examples;
    	validate_store(examples, "examples");
    	component_subscribe($$self, examples, $$value => $$invalidate(5, $examples = $$value));
    	let data1 = $examples.and.json;

    	var rjql1 = `data>dataFields[]:
    name = "MsnAcquisition"
    series>length = "1"`;

    	var data2 = `[{
  "id": 1,
  "first_name": "Jeanette",
  "last_name": "Penddreth",
  "email": "jpenddreth0@census.gov",
  "gender": "Female",
  "ip_address": "26.58.193.2"
}, {
  "id": 2,
  "first_name": "Giavani",
  "last_name": "Frediani",
  "email": "gfrediani1@senate.gov",
  "gender": "Male",
  "ip_address": "229.179.4.212"
}, {
  "id": 3,
  "first_name": "Noell",
  "last_name": "Bea",
  "email": "nbea2@imageshack.us",
  "gender": "Female",
  "ip_address": "180.66.162.255"
}, {
  "id": 4,
  "first_name": "Willard",
  "last_name": "Valek",
  "email": "wvalek3@vk.com",
  "gender": "Male",
  "ip_address": "67.76.188.26"
}]`;

    	var rjql2 = `[]:
    $count{gender: /Male/} = "2"`;

    	var data3 = `{
  "Employees": [
    {
      "userId": "krish",
      "jobTitle": "Developer",
      "firstName": "Krish",
      "lastName": "Lee",
      "employeeCode": "E1",
      "region": "CA",
      "phoneNumber": "123456",
      "emailAddress": "krish.lee@learningcontainer.com"
    },
    {
      "userId": "devid",
      "jobTitle": "Developer",
      "firstName": "Devid",
      "lastName": "Rome",
      "employeeCode": "E2",
      "region": "CA",
      "phoneNumber": "1111111",
      "emailAddress": "devid.rome@learningcontainer.com"
    },
    {
      "userId": "tin",
      "jobTitle": "Program Directory",
      "firstName": "tin",
      "lastName": "jonson",
      "employeeCode": "E3",
      "region": "CA",
      "phoneNumber": "2222222",
      "emailAddress": "tin.jonson@learningcontainer.com"
    }
  ]
}`;

    	var rjql3 = `Employees[]:
	phoneNumber = "$regex{\\d+}"
`;

    	var dataArr = [data1, data2, data3];
    	var rjqlArr = [rjql1, rjql2, rjql3];
    	var index = 0;
    	var showEditor = false;
    	var json;
    	var rjql;
    	update();

    	function update() {
    		$$invalidate(1, showEditor = false);
    		$$invalidate(2, json = dataArr[index]);
    		$$invalidate(3, rjql = rjqlArr[index]);

    		setTimeout(
    			() => {
    				$$invalidate(1, showEditor = true);
    			},
    			100
    		);
    	}

    	function select_change_handler() {
    		index = select_value(this);
    		$$invalidate(0, index);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("data1" in $$props) data1 = $$props.data1;
    		if ("rjql1" in $$props) rjql1 = $$props.rjql1;
    		if ("data2" in $$props) data2 = $$props.data2;
    		if ("rjql2" in $$props) rjql2 = $$props.rjql2;
    		if ("data3" in $$props) data3 = $$props.data3;
    		if ("rjql3" in $$props) rjql3 = $$props.rjql3;
    		if ("dataArr" in $$props) dataArr = $$props.dataArr;
    		if ("rjqlArr" in $$props) rjqlArr = $$props.rjqlArr;
    		if ("index" in $$props) $$invalidate(0, index = $$props.index);
    		if ("showEditor" in $$props) $$invalidate(1, showEditor = $$props.showEditor);
    		if ("json" in $$props) $$invalidate(2, json = $$props.json);
    		if ("rjql" in $$props) $$invalidate(3, rjql = $$props.rjql);
    		if ("$examples" in $$props) examples.set($examples = $$props.$examples);
    	};

    	return [
    		index,
    		showEditor,
    		json,
    		rjql,
    		update,
    		$examples,
    		data1,
    		rjql1,
    		data2,
    		rjql2,
    		data3,
    		rjql3,
    		dataArr,
    		rjqlArr,
    		select_change_handler
    	];
    }

    class Repl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Repl",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\QueryVariables.svelte generated by Svelte v3.18.1 */
    const file$6 = "src\\QueryVariables.svelte";

    function create_fragment$6(ctx) {
    	let div0;
    	let t1;
    	let div9;
    	let div1;
    	let t3;
    	let div8;
    	let div5;
    	let div2;
    	let i0;
    	let t4;
    	let t5;
    	let div3;
    	let t6;
    	let div4;
    	let p0;
    	let t8;
    	let p1;
    	let t9;
    	let span0;
    	let t11;
    	let t12;
    	let div7;
    	let div6;
    	let i1;
    	let t13;
    	let t14;
    	let p2;
    	let t15;
    	let span1;
    	let t17;
    	let t18;
    	let div17;
    	let div16;
    	let div13;
    	let div10;
    	let i2;
    	let t19;
    	let t20;
    	let div11;
    	let t21;
    	let div12;
    	let p3;
    	let t23;
    	let p4;
    	let t24;
    	let span2;
    	let t26;
    	let t27;
    	let div15;
    	let div14;
    	let i3;
    	let t28;
    	let t29;
    	let p5;
    	let t30;
    	let span3;
    	let t32;
    	let t33;
    	let div26;
    	let div18;
    	let t35;
    	let div25;
    	let div22;
    	let div19;
    	let i4;
    	let t36;
    	let t37;
    	let div20;
    	let t38;
    	let div21;
    	let p6;
    	let t40;
    	let p7;
    	let t41;
    	let span4;
    	let t43;
    	let t44;
    	let div24;
    	let div23;
    	let i5;
    	let t45;
    	let t46;
    	let p8;
    	let t47;
    	let span5;
    	let t58;
    	let t59;
    	let t60;
    	let div36;
    	let div27;
    	let t62;
    	let div28;
    	let p9;
    	let t64;
    	let div35;
    	let div32;
    	let div29;
    	let i6;
    	let t65;
    	let t66;
    	let div30;
    	let t67;
    	let div31;
    	let p10;
    	let t69;
    	let p11;
    	let t70;
    	let span6;
    	let t72;
    	let span7;
    	let t74;
    	let span8;
    	let t76;
    	let span9;
    	let t78;
    	let span10;
    	let t80;
    	let t81;
    	let div34;
    	let div33;
    	let i7;
    	let t82;
    	let t83;
    	let p12;
    	let t84;
    	let span11;
    	let t86;
    	let span12;
    	let t88;
    	let br0;
    	let t89;
    	let span13;
    	let t91;
    	let span14;
    	let t93;
    	let t94;
    	let div47;
    	let div37;
    	let t96;
    	let div38;
    	let t97;
    	let div46;
    	let div45;
    	let div39;
    	let i8;
    	let t98;
    	let br1;
    	let t99;
    	let div40;
    	let t100;
    	let div41;
    	let p13;
    	let t102;
    	let p14;
    	let t103;
    	let br2;
    	let t104;
    	let span15;
    	let t106;
    	let br3;
    	let t107;
    	let span16;
    	let t109;
    	let span17;
    	let t111;
    	let span18;
    	let t113;
    	let t114;
    	let div42;
    	let i9;
    	let t115;
    	let br4;
    	let t116;
    	let div43;
    	let t117;
    	let div44;
    	let p15;
    	let t119;
    	let p16;
    	let t120;
    	let br5;
    	let t121;
    	let span19;
    	let t123;
    	let span20;
    	let t125;
    	let t126;
    	let div54;
    	let div48;
    	let t128;
    	let div53;
    	let div52;
    	let div49;
    	let i10;
    	let t129;
    	let t130;
    	let div50;
    	let t131;
    	let div51;
    	let p17;
    	let t133;
    	let p18;
    	let t134;
    	let span21;
    	let t136;
    	let current;

    	const codeexecutor0 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].sort.json,
    				_rjql: /*$examples*/ ctx[0].sort.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor1 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].sort1.json,
    				_rjql: /*$examples*/ ctx[0].sort1.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor2 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].uuid.json,
    				_rjql: /*$examples*/ ctx[0].uuid.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor3 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].regex.json,
    				_rjql: /*$examples*/ ctx[0].regex.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor4 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].in.json,
    				_rjql: /*$examples*/ ctx[0].in.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor5 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].in_2.json,
    				_rjql: /*$examples*/ ctx[0].in_2.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor6 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].ip.json,
    				_rjql: /*$examples*/ ctx[0].ip.rjql
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Query Variables";
    			t1 = space();
    			div9 = element("div");
    			div1 = element("div");
    			div1.textContent = "$sort";
    			t3 = space();
    			div8 = element("div");
    			div5 = element("div");
    			div2 = element("div");
    			i0 = element("i");
    			t4 = text("\r\n        Example:");
    			t5 = space();
    			div3 = element("div");
    			create_component(codeexecutor0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			p0 = element("p");
    			p0.textContent = "Explanation";
    			t8 = space();
    			p1 = element("p");
    			t9 = text("The query\r\n        ");
    			span0 = element("span");
    			span0.textContent = "cars[] = \"$asort\"";
    			t11 = text("\r\n        sorts the array in ascending order.");
    			t12 = space();
    			div7 = element("div");
    			div6 = element("div");
    			i1 = element("i");
    			t13 = text("\r\n        NOTE");
    			t14 = space();
    			p2 = element("p");
    			t15 = text("Inorder to sort in ascending order we can write\r\n        ");
    			span1 = element("span");
    			span1.textContent = "cars[] = \"$asort\"";
    			t17 = text("\r\n      .");
    			t18 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div13 = element("div");
    			div10 = element("div");
    			i2 = element("i");
    			t19 = text("\r\n        Example:");
    			t20 = space();
    			div11 = element("div");
    			create_component(codeexecutor1.$$.fragment);
    			t21 = space();
    			div12 = element("div");
    			p3 = element("p");
    			p3.textContent = "Explanation";
    			t23 = space();
    			p4 = element("p");
    			t24 = text("The query\r\n        ");
    			span2 = element("span");
    			span2.textContent = "cars[] = \"$dsort\"";
    			t26 = text("\r\n        sorts the array in descending order based on the property");
    			t27 = space();
    			div15 = element("div");
    			div14 = element("div");
    			i3 = element("i");
    			t28 = text("\r\n        NOTE");
    			t29 = space();
    			p5 = element("p");
    			t30 = text("Inorder to sort in descending order we can write\r\n        ");
    			span3 = element("span");
    			span3.textContent = "cars[] = \"$dsort\"";
    			t32 = text("\r\n      .");
    			t33 = space();
    			div26 = element("div");
    			div18 = element("div");
    			div18.textContent = "$uuid";
    			t35 = space();
    			div25 = element("div");
    			div22 = element("div");
    			div19 = element("div");
    			i4 = element("i");
    			t36 = text("\r\n        Example:");
    			t37 = space();
    			div20 = element("div");
    			create_component(codeexecutor2.$$.fragment);
    			t38 = space();
    			div21 = element("div");
    			p6 = element("p");
    			p6.textContent = "Explanation";
    			t40 = space();
    			p7 = element("p");
    			t41 = text("Checks whether the value of the field\r\n        ");
    			span4 = element("span");
    			span4.textContent = "id";
    			t43 = text("\r\n        is in the form of UUID.");
    			t44 = space();
    			div24 = element("div");
    			div23 = element("div");
    			i5 = element("i");
    			t45 = text("\r\n        NOTE");
    			t46 = space();
    			p8 = element("p");
    			t47 = text("UUID format is\r\n         ");
    			span5 = element("span");

    			span5.textContent = `
          [0-9a-fA-F]${8}\\-[0-9a-fA-F]${4}\\-[0-9a-fA-F]${4}\\-[0-9a-fA-F]${4}\\-[0-9a-fA-F]${12}`;

    			t58 = text("\r\n        .");
    			t59 = text("\r\n      .");
    			t60 = space();
    			div36 = element("div");
    			div27 = element("div");
    			div27.textContent = "$regex";
    			t62 = space();
    			div28 = element("div");
    			p9 = element("p");
    			p9.textContent = "Example for checking Regular Expression:";
    			t64 = space();
    			div35 = element("div");
    			div32 = element("div");
    			div29 = element("div");
    			i6 = element("i");
    			t65 = text("\r\n        Example:");
    			t66 = space();
    			div30 = element("div");
    			create_component(codeexecutor3.$$.fragment);
    			t67 = space();
    			div31 = element("div");
    			p10 = element("p");
    			p10.textContent = "Explanation";
    			t69 = space();
    			p11 = element("p");
    			t70 = text("Checking whether the value of the field\r\n        ");
    			span6 = element("span");
    			span6.textContent = "model";
    			t72 = text("\r\n        inside the array\r\n        ");
    			span7 = element("span");
    			span7.textContent = "cars";
    			t74 = text("\r\n        is the form of\r\n        ");
    			span8 = element("span");
    			span8.textContent = "/^[a-z]$/";
    			t76 = text("\r\n        if the\r\n        ");
    			span9 = element("span");
    			span9.textContent = "company";
    			t78 = text("\r\n        is equal to\r\n        ");
    			span10 = element("span");
    			span10.textContent = "BMW";
    			t80 = text("\r\n        .");
    			t81 = space();
    			div34 = element("div");
    			div33 = element("div");
    			i7 = element("i");
    			t82 = text("\r\n        NOTE");
    			t83 = space();
    			p12 = element("p");
    			t84 = text("Using\r\n        ");
    			span11 = element("span");
    			span11.textContent = "/.../";
    			t86 = text("\r\n        inside\r\n        ");
    			span12 = element("span");
    			span12.textContent = `${/*k*/ ctx[1]}`;
    			t88 = text("\r\n        is optional.\r\n        ");
    			br0 = element("br");
    			t89 = text("\r\n        For character we can use\r\n        ");
    			span13 = element("span");
    			span13.textContent = "\\w";
    			t91 = text("\r\n        , for digit we can use\r\n        ");
    			span14 = element("span");
    			span14.textContent = "\\d";
    			t93 = text("\r\n      .");
    			t94 = space();
    			div47 = element("div");
    			div37 = element("div");
    			div37.textContent = "$in";
    			t96 = space();
    			div38 = element("div");
    			t97 = space();
    			div46 = element("div");
    			div45 = element("div");
    			div39 = element("div");
    			i8 = element("i");
    			t98 = text("\r\n        Example 1\r\n        ");
    			br1 = element("br");
    			t99 = space();
    			div40 = element("div");
    			create_component(codeexecutor4.$$.fragment);
    			t100 = space();
    			div41 = element("div");
    			p13 = element("p");
    			p13.textContent = "Explanation";
    			t102 = space();
    			p14 = element("p");
    			t103 = text("This query will search for the value/values.\r\n          ");
    			br2 = element("br");
    			t104 = text("\r\n          The first line is used to traverse inside the\r\n          ");
    			span15 = element("span");
    			span15.textContent = "cars";
    			t106 = text("\r\n          .\r\n          ");
    			br3 = element("br");
    			t107 = text("\r\n          In the second line the query is searching whether the value\r\n          ");
    			span16 = element("span");
    			span16.textContent = "Nissan";
    			t109 = text("\r\n          given inside\r\n          ");
    			span17 = element("span");
    			span17.textContent = "in";
    			t111 = text("\r\n          matches with value of left-hand property\r\n          ");
    			span18 = element("span");
    			span18.textContent = "company";
    			t113 = text("\r\n          .");
    			t114 = space();
    			div42 = element("div");
    			i9 = element("i");
    			t115 = text("\r\n        Example 2\r\n        ");
    			br4 = element("br");
    			t116 = space();
    			div43 = element("div");
    			create_component(codeexecutor5.$$.fragment);
    			t117 = space();
    			div44 = element("div");
    			p15 = element("p");
    			p15.textContent = "Explanation";
    			t119 = space();
    			p16 = element("p");
    			t120 = text("This query will search for the value/values.\r\n          ");
    			br5 = element("br");
    			t121 = text("\r\n          The query is searching whether the values given inside\r\n          ");
    			span19 = element("span");
    			span19.textContent = "in";
    			t123 = text("\r\n          matches with values of array\r\n          ");
    			span20 = element("span");
    			span20.textContent = "cars";
    			t125 = text("\r\n          on the left-hand side.");
    			t126 = space();
    			div54 = element("div");
    			div48 = element("div");
    			div48.textContent = "$ip";
    			t128 = space();
    			div53 = element("div");
    			div52 = element("div");
    			div49 = element("div");
    			i10 = element("i");
    			t129 = text("\r\n        Example:");
    			t130 = space();
    			div50 = element("div");
    			create_component(codeexecutor6.$$.fragment);
    			t131 = space();
    			div51 = element("div");
    			p17 = element("p");
    			p17.textContent = "Explanation";
    			t133 = space();
    			p18 = element("p");
    			t134 = text("Checks whether the value of the field\r\n        ");
    			span21 = element("span");
    			span21.textContent = "ip_address";
    			t136 = text("\r\n        is in the form of IP Address.");
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$6, 8, 0, 169);
    			attr_dev(div1, "class", "heading");
    			add_location(div1, file$6, 11, 2, 252);
    			attr_dev(i0, "class", "fas fa-check");
    			add_location(i0, file$6, 16, 8, 376);
    			attr_dev(div2, "class", "title");
    			add_location(div2, file$6, 15, 6, 347);
    			attr_dev(div3, "class", "ce");
    			add_location(div3, file$6, 19, 6, 442);
    			attr_dev(p0, "class", "title");
    			add_location(p0, file$6, 23, 8, 596);
    			attr_dev(div4, "class", "explanation");
    			add_location(div4, file$6, 22, 6, 561);
    			attr_dev(span0, "class", "span_style");
    			add_location(span0, file$6, 30, 8, 706);
    			add_location(p1, file$6, 28, 6, 674);
    			attr_dev(div5, "class", "example");
    			add_location(div5, file$6, 14, 4, 318);
    			attr_dev(i1, "class", "fas fa-asterisk");
    			add_location(i1, file$6, 36, 8, 890);
    			attr_dev(div6, "class", "note_style");
    			add_location(div6, file$6, 35, 6, 856);
    			attr_dev(span1, "class", "span_style");
    			add_location(span1, file$6, 41, 8, 1025);
    			add_location(p2, file$6, 39, 6, 955);
    			attr_dev(div7, "class", "note");
    			add_location(div7, file$6, 34, 4, 830);
    			attr_dev(div8, "class", "examples");
    			add_location(div8, file$6, 13, 2, 290);
    			attr_dev(div9, "class", "Example_block first");
    			add_location(div9, file$6, 10, 0, 215);
    			attr_dev(i2, "class", "fas fa-check");
    			add_location(i2, file$6, 53, 8, 1248);
    			attr_dev(div10, "class", "title");
    			add_location(div10, file$6, 52, 6, 1219);
    			attr_dev(div11, "class", "ce");
    			add_location(div11, file$6, 56, 6, 1314);
    			attr_dev(p3, "class", "title");
    			add_location(p3, file$6, 60, 8, 1470);
    			attr_dev(div12, "class", "explanation");
    			add_location(div12, file$6, 59, 6, 1435);
    			attr_dev(span2, "class", "span_style");
    			add_location(span2, file$6, 67, 8, 1580);
    			add_location(p4, file$6, 65, 6, 1548);
    			attr_dev(div13, "class", "example");
    			add_location(div13, file$6, 51, 4, 1190);
    			attr_dev(i3, "class", "fas fa-asterisk");
    			add_location(i3, file$6, 73, 8, 1786);
    			attr_dev(div14, "class", "note_style");
    			add_location(div14, file$6, 72, 6, 1752);
    			attr_dev(span3, "class", "span_style");
    			add_location(span3, file$6, 78, 8, 1922);
    			add_location(p5, file$6, 76, 6, 1851);
    			attr_dev(div15, "class", "note");
    			add_location(div15, file$6, 71, 4, 1726);
    			attr_dev(div16, "class", "examples");
    			add_location(div16, file$6, 50, 2, 1162);
    			attr_dev(div17, "class", "Example_block");
    			add_location(div17, file$6, 48, 0, 1129);
    			attr_dev(div18, "class", "heading");
    			add_location(div18, file$6, 87, 2, 2059);
    			attr_dev(i4, "class", "fas fa-check");
    			add_location(i4, file$6, 92, 8, 2183);
    			attr_dev(div19, "class", "title");
    			add_location(div19, file$6, 91, 6, 2154);
    			attr_dev(div20, "class", "ce");
    			add_location(div20, file$6, 95, 6, 2249);
    			attr_dev(p6, "class", "title");
    			add_location(p6, file$6, 99, 8, 2403);
    			attr_dev(div21, "class", "explanation");
    			add_location(div21, file$6, 98, 6, 2368);
    			attr_dev(span4, "class", "span_style");
    			add_location(span4, file$6, 106, 8, 2541);
    			add_location(p7, file$6, 104, 6, 2481);
    			attr_dev(div22, "class", "example");
    			add_location(div22, file$6, 90, 4, 2125);
    			attr_dev(i5, "class", "fas fa-asterisk");
    			add_location(i5, file$6, 112, 8, 2698);
    			attr_dev(div23, "class", "note_style");
    			add_location(div23, file$6, 111, 6, 2664);
    			attr_dev(span5, "class", "span_style");
    			add_location(span5, file$6, 117, 9, 2801);
    			add_location(p8, file$6, 115, 6, 2763);
    			attr_dev(div24, "class", "note");
    			add_location(div24, file$6, 110, 4, 2638);
    			attr_dev(div25, "class", "examples");
    			add_location(div25, file$6, 89, 2, 2097);
    			attr_dev(div26, "class", "Example_block");
    			add_location(div26, file$6, 85, 0, 2026);
    			attr_dev(div27, "class", "heading");
    			add_location(div27, file$6, 129, 2, 3033);
    			add_location(p9, file$6, 131, 4, 3101);
    			attr_dev(div28, "class", "discription");
    			add_location(div28, file$6, 130, 2, 3070);
    			attr_dev(i6, "class", "fas fa-check");
    			add_location(i6, file$6, 136, 8, 3248);
    			attr_dev(div29, "class", "title");
    			add_location(div29, file$6, 135, 6, 3219);
    			attr_dev(div30, "class", "ce");
    			add_location(div30, file$6, 139, 6, 3314);
    			attr_dev(p10, "class", "title");
    			add_location(p10, file$6, 143, 8, 3470);
    			attr_dev(div31, "class", "explanation");
    			add_location(div31, file$6, 142, 6, 3435);
    			attr_dev(span6, "class", "span_style");
    			add_location(span6, file$6, 150, 8, 3610);
    			attr_dev(span7, "class", "span_style");
    			add_location(span7, file$6, 152, 8, 3683);
    			attr_dev(span8, "class", "span_style");
    			add_location(span8, file$6, 154, 8, 3753);
    			attr_dev(span9, "class", "span_style");
    			add_location(span9, file$6, 156, 8, 3820);
    			attr_dev(span10, "class", "span_style");
    			add_location(span10, file$6, 158, 8, 3890);
    			add_location(p11, file$6, 148, 6, 3548);
    			attr_dev(div32, "class", "example");
    			add_location(div32, file$6, 134, 4, 3190);
    			attr_dev(i7, "class", "fas fa-asterisk");
    			add_location(i7, file$6, 164, 8, 4026);
    			attr_dev(div33, "class", "note_style");
    			add_location(div33, file$6, 163, 6, 3992);
    			attr_dev(span11, "class", "span_style");
    			add_location(span11, file$6, 169, 8, 4119);
    			attr_dev(span12, "class", "span_style");
    			add_location(span12, file$6, 171, 8, 4182);
    			add_location(br0, file$6, 173, 8, 4249);
    			attr_dev(span13, "class", "span_style");
    			add_location(span13, file$6, 175, 8, 4299);
    			attr_dev(span14, "class", "span_style");
    			add_location(span14, file$6, 177, 8, 4375);
    			add_location(p12, file$6, 167, 6, 4091);
    			attr_dev(div34, "class", "note");
    			add_location(div34, file$6, 162, 4, 3966);
    			attr_dev(div35, "class", "examples");
    			add_location(div35, file$6, 133, 2, 3162);
    			attr_dev(div36, "class", "Example_block");
    			add_location(div36, file$6, 127, 0, 3000);
    			attr_dev(div37, "class", "heading");
    			add_location(div37, file$6, 186, 2, 4497);
    			attr_dev(div38, "class", "discription");
    			add_location(div38, file$6, 187, 2, 4531);
    			attr_dev(i8, "class", "fas fa-check");
    			add_location(i8, file$6, 191, 8, 4648);
    			add_location(br1, file$6, 193, 8, 4703);
    			attr_dev(div39, "class", "title");
    			add_location(div39, file$6, 190, 6, 4619);
    			attr_dev(div40, "class", "ce");
    			add_location(div40, file$6, 195, 6, 4731);
    			attr_dev(p13, "class", "title");
    			add_location(p13, file$6, 199, 8, 4881);
    			add_location(br2, file$6, 202, 10, 4994);
    			attr_dev(span15, "class", "span_style");
    			add_location(span15, file$6, 204, 10, 5069);
    			add_location(br3, file$6, 206, 10, 5130);
    			attr_dev(span16, "class", "span_style");
    			add_location(span16, file$6, 208, 10, 5219);
    			attr_dev(span17, "class", "span_style");
    			add_location(span17, file$6, 210, 10, 5293);
    			attr_dev(span18, "class", "span_style");
    			add_location(span18, file$6, 212, 10, 5391);
    			add_location(p14, file$6, 200, 8, 4923);
    			attr_dev(div41, "class", "explanation");
    			add_location(div41, file$6, 198, 6, 4846);
    			attr_dev(i9, "class", "fas fa-check");
    			add_location(i9, file$6, 218, 8, 5510);
    			add_location(br4, file$6, 220, 8, 5565);
    			attr_dev(div42, "class", "title");
    			add_location(div42, file$6, 217, 6, 5481);
    			attr_dev(div43, "class", "ce");
    			add_location(div43, file$6, 222, 6, 5593);
    			attr_dev(p15, "class", "title");
    			add_location(p15, file$6, 226, 8, 5747);
    			add_location(br5, file$6, 229, 10, 5860);
    			attr_dev(span19, "class", "span_style");
    			add_location(span19, file$6, 231, 10, 5944);
    			attr_dev(span20, "class", "span_style");
    			add_location(span20, file$6, 233, 10, 6030);
    			add_location(p16, file$6, 227, 8, 5789);
    			attr_dev(div44, "class", "explanation");
    			add_location(div44, file$6, 225, 6, 5712);
    			attr_dev(div45, "class", "example");
    			add_location(div45, file$6, 189, 4, 4590);
    			attr_dev(div46, "class", "examples");
    			add_location(div46, file$6, 188, 2, 4562);
    			attr_dev(div47, "class", "Example_block");
    			add_location(div47, file$6, 185, 0, 4466);
    			attr_dev(div48, "class", "heading");
    			add_location(div48, file$6, 244, 2, 6197);
    			attr_dev(i10, "class", "fas fa-check");
    			add_location(i10, file$6, 249, 8, 6319);
    			attr_dev(div49, "class", "title");
    			add_location(div49, file$6, 248, 6, 6290);
    			attr_dev(div50, "class", "ce");
    			add_location(div50, file$6, 252, 6, 6385);
    			attr_dev(p17, "class", "title");
    			add_location(p17, file$6, 256, 8, 6535);
    			attr_dev(div51, "class", "explanation");
    			add_location(div51, file$6, 255, 6, 6500);
    			attr_dev(span21, "class", "span_style");
    			add_location(span21, file$6, 263, 8, 6673);
    			add_location(p18, file$6, 261, 6, 6613);
    			attr_dev(div52, "class", "example");
    			add_location(div52, file$6, 247, 4, 6261);
    			attr_dev(div53, "class", "examples");
    			add_location(div53, file$6, 246, 2, 6233);
    			attr_dev(div54, "class", "Example_block");
    			add_location(div54, file$6, 242, 0, 6164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div1);
    			append_dev(div9, t3);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div5, div2);
    			append_dev(div2, i0);
    			append_dev(div2, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			mount_component(codeexecutor0, div3, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, p0);
    			append_dev(div5, t8);
    			append_dev(div5, p1);
    			append_dev(p1, t9);
    			append_dev(p1, span0);
    			append_dev(p1, t11);
    			append_dev(div8, t12);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, i1);
    			append_dev(div6, t13);
    			append_dev(div7, t14);
    			append_dev(div7, p2);
    			append_dev(p2, t15);
    			append_dev(p2, span1);
    			append_dev(div7, t17);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div16);
    			append_dev(div16, div13);
    			append_dev(div13, div10);
    			append_dev(div10, i2);
    			append_dev(div10, t19);
    			append_dev(div13, t20);
    			append_dev(div13, div11);
    			mount_component(codeexecutor1, div11, null);
    			append_dev(div13, t21);
    			append_dev(div13, div12);
    			append_dev(div12, p3);
    			append_dev(div13, t23);
    			append_dev(div13, p4);
    			append_dev(p4, t24);
    			append_dev(p4, span2);
    			append_dev(p4, t26);
    			append_dev(div16, t27);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, i3);
    			append_dev(div14, t28);
    			append_dev(div15, t29);
    			append_dev(div15, p5);
    			append_dev(p5, t30);
    			append_dev(p5, span3);
    			append_dev(div15, t32);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, div26, anchor);
    			append_dev(div26, div18);
    			append_dev(div26, t35);
    			append_dev(div26, div25);
    			append_dev(div25, div22);
    			append_dev(div22, div19);
    			append_dev(div19, i4);
    			append_dev(div19, t36);
    			append_dev(div22, t37);
    			append_dev(div22, div20);
    			mount_component(codeexecutor2, div20, null);
    			append_dev(div22, t38);
    			append_dev(div22, div21);
    			append_dev(div21, p6);
    			append_dev(div22, t40);
    			append_dev(div22, p7);
    			append_dev(p7, t41);
    			append_dev(p7, span4);
    			append_dev(p7, t43);
    			append_dev(div25, t44);
    			append_dev(div25, div24);
    			append_dev(div24, div23);
    			append_dev(div23, i5);
    			append_dev(div23, t45);
    			append_dev(div24, t46);
    			append_dev(div24, p8);
    			append_dev(p8, t47);
    			append_dev(p8, span5);
    			append_dev(p8, t58);
    			append_dev(div24, t59);
    			insert_dev(target, t60, anchor);
    			insert_dev(target, div36, anchor);
    			append_dev(div36, div27);
    			append_dev(div36, t62);
    			append_dev(div36, div28);
    			append_dev(div28, p9);
    			append_dev(div36, t64);
    			append_dev(div36, div35);
    			append_dev(div35, div32);
    			append_dev(div32, div29);
    			append_dev(div29, i6);
    			append_dev(div29, t65);
    			append_dev(div32, t66);
    			append_dev(div32, div30);
    			mount_component(codeexecutor3, div30, null);
    			append_dev(div32, t67);
    			append_dev(div32, div31);
    			append_dev(div31, p10);
    			append_dev(div32, t69);
    			append_dev(div32, p11);
    			append_dev(p11, t70);
    			append_dev(p11, span6);
    			append_dev(p11, t72);
    			append_dev(p11, span7);
    			append_dev(p11, t74);
    			append_dev(p11, span8);
    			append_dev(p11, t76);
    			append_dev(p11, span9);
    			append_dev(p11, t78);
    			append_dev(p11, span10);
    			append_dev(p11, t80);
    			append_dev(div35, t81);
    			append_dev(div35, div34);
    			append_dev(div34, div33);
    			append_dev(div33, i7);
    			append_dev(div33, t82);
    			append_dev(div34, t83);
    			append_dev(div34, p12);
    			append_dev(p12, t84);
    			append_dev(p12, span11);
    			append_dev(p12, t86);
    			append_dev(p12, span12);
    			append_dev(p12, t88);
    			append_dev(p12, br0);
    			append_dev(p12, t89);
    			append_dev(p12, span13);
    			append_dev(p12, t91);
    			append_dev(p12, span14);
    			append_dev(div34, t93);
    			insert_dev(target, t94, anchor);
    			insert_dev(target, div47, anchor);
    			append_dev(div47, div37);
    			append_dev(div47, t96);
    			append_dev(div47, div38);
    			append_dev(div47, t97);
    			append_dev(div47, div46);
    			append_dev(div46, div45);
    			append_dev(div45, div39);
    			append_dev(div39, i8);
    			append_dev(div39, t98);
    			append_dev(div39, br1);
    			append_dev(div45, t99);
    			append_dev(div45, div40);
    			mount_component(codeexecutor4, div40, null);
    			append_dev(div45, t100);
    			append_dev(div45, div41);
    			append_dev(div41, p13);
    			append_dev(div41, t102);
    			append_dev(div41, p14);
    			append_dev(p14, t103);
    			append_dev(p14, br2);
    			append_dev(p14, t104);
    			append_dev(p14, span15);
    			append_dev(p14, t106);
    			append_dev(p14, br3);
    			append_dev(p14, t107);
    			append_dev(p14, span16);
    			append_dev(p14, t109);
    			append_dev(p14, span17);
    			append_dev(p14, t111);
    			append_dev(p14, span18);
    			append_dev(p14, t113);
    			append_dev(div45, t114);
    			append_dev(div45, div42);
    			append_dev(div42, i9);
    			append_dev(div42, t115);
    			append_dev(div42, br4);
    			append_dev(div45, t116);
    			append_dev(div45, div43);
    			mount_component(codeexecutor5, div43, null);
    			append_dev(div45, t117);
    			append_dev(div45, div44);
    			append_dev(div44, p15);
    			append_dev(div44, t119);
    			append_dev(div44, p16);
    			append_dev(p16, t120);
    			append_dev(p16, br5);
    			append_dev(p16, t121);
    			append_dev(p16, span19);
    			append_dev(p16, t123);
    			append_dev(p16, span20);
    			append_dev(p16, t125);
    			insert_dev(target, t126, anchor);
    			insert_dev(target, div54, anchor);
    			append_dev(div54, div48);
    			append_dev(div54, t128);
    			append_dev(div54, div53);
    			append_dev(div53, div52);
    			append_dev(div52, div49);
    			append_dev(div49, i10);
    			append_dev(div49, t129);
    			append_dev(div52, t130);
    			append_dev(div52, div50);
    			mount_component(codeexecutor6, div50, null);
    			append_dev(div52, t131);
    			append_dev(div52, div51);
    			append_dev(div51, p17);
    			append_dev(div52, t133);
    			append_dev(div52, p18);
    			append_dev(p18, t134);
    			append_dev(p18, span21);
    			append_dev(p18, t136);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const codeexecutor0_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes.json = /*$examples*/ ctx[0].sort.json;
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes._rjql = /*$examples*/ ctx[0].sort.rjql;
    			codeexecutor0.$set(codeexecutor0_changes);
    			const codeexecutor1_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes.json = /*$examples*/ ctx[0].sort1.json;
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes._rjql = /*$examples*/ ctx[0].sort1.rjql;
    			codeexecutor1.$set(codeexecutor1_changes);
    			const codeexecutor2_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor2_changes.json = /*$examples*/ ctx[0].uuid.json;
    			if (dirty & /*$examples*/ 1) codeexecutor2_changes._rjql = /*$examples*/ ctx[0].uuid.rjql;
    			codeexecutor2.$set(codeexecutor2_changes);
    			const codeexecutor3_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor3_changes.json = /*$examples*/ ctx[0].regex.json;
    			if (dirty & /*$examples*/ 1) codeexecutor3_changes._rjql = /*$examples*/ ctx[0].regex.rjql;
    			codeexecutor3.$set(codeexecutor3_changes);
    			const codeexecutor4_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor4_changes.json = /*$examples*/ ctx[0].in.json;
    			if (dirty & /*$examples*/ 1) codeexecutor4_changes._rjql = /*$examples*/ ctx[0].in.rjql;
    			codeexecutor4.$set(codeexecutor4_changes);
    			const codeexecutor5_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor5_changes.json = /*$examples*/ ctx[0].in_2.json;
    			if (dirty & /*$examples*/ 1) codeexecutor5_changes._rjql = /*$examples*/ ctx[0].in_2.rjql;
    			codeexecutor5.$set(codeexecutor5_changes);
    			const codeexecutor6_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor6_changes.json = /*$examples*/ ctx[0].ip.json;
    			if (dirty & /*$examples*/ 1) codeexecutor6_changes._rjql = /*$examples*/ ctx[0].ip.rjql;
    			codeexecutor6.$set(codeexecutor6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(codeexecutor0.$$.fragment, local);
    			transition_in(codeexecutor1.$$.fragment, local);
    			transition_in(codeexecutor2.$$.fragment, local);
    			transition_in(codeexecutor3.$$.fragment, local);
    			transition_in(codeexecutor4.$$.fragment, local);
    			transition_in(codeexecutor5.$$.fragment, local);
    			transition_in(codeexecutor6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(codeexecutor0.$$.fragment, local);
    			transition_out(codeexecutor1.$$.fragment, local);
    			transition_out(codeexecutor2.$$.fragment, local);
    			transition_out(codeexecutor3.$$.fragment, local);
    			transition_out(codeexecutor4.$$.fragment, local);
    			transition_out(codeexecutor5.$$.fragment, local);
    			transition_out(codeexecutor6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div9);
    			destroy_component(codeexecutor0);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div17);
    			destroy_component(codeexecutor1);
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(div26);
    			destroy_component(codeexecutor2);
    			if (detaching) detach_dev(t60);
    			if (detaching) detach_dev(div36);
    			destroy_component(codeexecutor3);
    			if (detaching) detach_dev(t94);
    			if (detaching) detach_dev(div47);
    			destroy_component(codeexecutor4);
    			destroy_component(codeexecutor5);
    			if (detaching) detach_dev(t126);
    			if (detaching) detach_dev(div54);
    			destroy_component(codeexecutor6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $examples;
    	validate_store(examples, "examples");
    	component_subscribe($$self, examples, $$value => $$invalidate(0, $examples = $$value));
    	var k = "{}";
    	var t = "{^\\w+\\d+$}";

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("k" in $$props) $$invalidate(1, k = $$props.k);
    		if ("t" in $$props) t = $$props.t;
    		if ("$examples" in $$props) examples.set($examples = $$props.$examples);
    	};

    	return [$examples, k];
    }

    class QueryVariables extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QueryVariables",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\AggregationFunction.svelte generated by Svelte v3.18.1 */
    const file$7 = "src\\AggregationFunction.svelte";

    function create_fragment$7(ctx) {
    	let div0;
    	let t1;
    	let div12;
    	let div1;
    	let t3;
    	let div11;
    	let div10;
    	let div2;
    	let i0;
    	let t4;
    	let br0;
    	let t5;
    	let div3;
    	let t6;
    	let div4;
    	let p0;
    	let t8;
    	let p1;
    	let t9;
    	let span0;
    	let t11;
    	let span1;
    	let t13;
    	let t14;
    	let div5;
    	let i1;
    	let t15;
    	let br1;
    	let t16;
    	let div6;
    	let t17;
    	let div7;
    	let p2;
    	let t19;
    	let p3;
    	let t20;
    	let span2;
    	let t22;
    	let span3;
    	let t24;
    	let span4;
    	let t26;
    	let t27;
    	let div9;
    	let div8;
    	let i2;
    	let t28;
    	let t29;
    	let p4;
    	let t31;
    	let t32;
    	let div20;
    	let div13;
    	let t34;
    	let div14;
    	let t35;
    	let div19;
    	let div18;
    	let div15;
    	let i3;
    	let t36;
    	let br2;
    	let t37;
    	let div16;
    	let t38;
    	let div17;
    	let p5;
    	let t40;
    	let p6;
    	let t41;
    	let span5;
    	let t43;
    	let br3;
    	let t44;
    	let span6;
    	let t46;
    	let span7;
    	let t48;
    	let t49;
    	let div28;
    	let div21;
    	let t51;
    	let div22;
    	let t52;
    	let div27;
    	let div26;
    	let div23;
    	let i4;
    	let t53;
    	let br4;
    	let t54;
    	let div24;
    	let t55;
    	let div25;
    	let p7;
    	let t57;
    	let p8;
    	let t58;
    	let span8;
    	let t60;
    	let br5;
    	let t61;
    	let span9;
    	let t63;
    	let span10;
    	let t65;
    	let t66;
    	let div36;
    	let div29;
    	let t68;
    	let div30;
    	let t69;
    	let div35;
    	let div34;
    	let div31;
    	let i5;
    	let t70;
    	let br6;
    	let t71;
    	let div32;
    	let t72;
    	let div33;
    	let p9;
    	let t74;
    	let p10;
    	let t75;
    	let span11;
    	let t77;
    	let br7;
    	let t78;
    	let span12;
    	let t80;
    	let span13;
    	let t82;
    	let t83;
    	let div44;
    	let div37;
    	let t85;
    	let div38;
    	let t86;
    	let div43;
    	let div42;
    	let div39;
    	let i6;
    	let t87;
    	let br8;
    	let t88;
    	let div40;
    	let t89;
    	let div41;
    	let p11;
    	let t91;
    	let p12;
    	let t92;
    	let span14;
    	let t94;
    	let br9;
    	let t95;
    	let span15;
    	let t97;
    	let span16;
    	let t99;
    	let current;

    	const codeexecutor0 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].count.json,
    				_rjql: /*$examples*/ ctx[0].count.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor1 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].count.json,
    				_rjql: /*$examples*/ ctx[0].count1.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor2 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].sum.json,
    				_rjql: /*$examples*/ ctx[0].sum.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor3 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].avg.json,
    				_rjql: /*$examples*/ ctx[0].avg.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor4 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].max.json,
    				_rjql: /*$examples*/ ctx[0].max.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor5 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].min.json,
    				_rjql: /*$examples*/ ctx[0].min.rjql
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Aggregation Function";
    			t1 = space();
    			div12 = element("div");
    			div1 = element("div");
    			div1.textContent = "$count";
    			t3 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div2 = element("div");
    			i0 = element("i");
    			t4 = text("\r\n        Example 1\r\n        ");
    			br0 = element("br");
    			t5 = space();
    			div3 = element("div");
    			create_component(codeexecutor0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			p0 = element("p");
    			p0.textContent = "Explanation";
    			t8 = space();
    			p1 = element("p");
    			t9 = text("Here the query is checking whether the number of\r\n          ");
    			span0 = element("span");
    			span0.textContent = "department";
    			t11 = text("\r\n          is\r\n          ");
    			span1 = element("span");
    			span1.textContent = "2";
    			t13 = text("\r\n          .");
    			t14 = space();
    			div5 = element("div");
    			i1 = element("i");
    			t15 = text("\r\n        Example 2\r\n        ");
    			br1 = element("br");
    			t16 = space();
    			div6 = element("div");
    			create_component(codeexecutor1.$$.fragment);
    			t17 = space();
    			div7 = element("div");
    			p2 = element("p");
    			p2.textContent = "Explanation";
    			t19 = space();
    			p3 = element("p");
    			t20 = text("Here the query is checking whether the number of\r\n          ");
    			span2 = element("span");
    			span2.textContent = "department";
    			t22 = text("\r\n          with name\r\n          ");
    			span3 = element("span");
    			span3.textContent = "Software";
    			t24 = text("\r\n          is equal to\r\n          ");
    			span4 = element("span");
    			span4.textContent = "1";
    			t26 = text("\r\n          .");
    			t27 = space();
    			div9 = element("div");
    			div8 = element("div");
    			i2 = element("i");
    			t28 = text("\r\n          NOTE");
    			t29 = space();
    			p4 = element("p");
    			p4.textContent = "We can also have regular expressions inside the count as shown above.\r\n          .";
    			t31 = text("\r\n        .");
    			t32 = space();
    			div20 = element("div");
    			div13 = element("div");
    			div13.textContent = "$sum";
    			t34 = space();
    			div14 = element("div");
    			t35 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div15 = element("div");
    			i3 = element("i");
    			t36 = text("\r\n        Example 1\r\n        ");
    			br2 = element("br");
    			t37 = space();
    			div16 = element("div");
    			create_component(codeexecutor2.$$.fragment);
    			t38 = space();
    			div17 = element("div");
    			p5 = element("p");
    			p5.textContent = "Explanation";
    			t40 = space();
    			p6 = element("p");
    			t41 = text("First line is used to traverse inside\r\n          ");
    			span5 = element("span");
    			span5.textContent = "employees";
    			t43 = text("\r\n          array.\r\n          ");
    			br3 = element("br");
    			t44 = text("\r\n          In the second line the query is checking whether the sum of the\r\n          property\r\n          ");
    			span6 = element("span");
    			span6.textContent = "salary";
    			t46 = text("\r\n          is equal to\r\n          ");
    			span7 = element("span");
    			span7.textContent = "130000";
    			t48 = text("\r\n          .");
    			t49 = space();
    			div28 = element("div");
    			div21 = element("div");
    			div21.textContent = "$avg";
    			t51 = space();
    			div22 = element("div");
    			t52 = space();
    			div27 = element("div");
    			div26 = element("div");
    			div23 = element("div");
    			i4 = element("i");
    			t53 = text("\r\n        Example 1\r\n        ");
    			br4 = element("br");
    			t54 = space();
    			div24 = element("div");
    			create_component(codeexecutor3.$$.fragment);
    			t55 = space();
    			div25 = element("div");
    			p7 = element("p");
    			p7.textContent = "Explanation";
    			t57 = space();
    			p8 = element("p");
    			t58 = text("First line is used to traverse inside\r\n          ");
    			span8 = element("span");
    			span8.textContent = "employees";
    			t60 = text("\r\n          array.\r\n          ");
    			br5 = element("br");
    			t61 = text("\r\n          In the second line the query is checking whether the average of the\r\n          property\r\n          ");
    			span9 = element("span");
    			span9.textContent = "salary";
    			t63 = text("\r\n          is equal to\r\n          ");
    			span10 = element("span");
    			span10.textContent = "75000";
    			t65 = text("\r\n          .");
    			t66 = space();
    			div36 = element("div");
    			div29 = element("div");
    			div29.textContent = "$max";
    			t68 = space();
    			div30 = element("div");
    			t69 = space();
    			div35 = element("div");
    			div34 = element("div");
    			div31 = element("div");
    			i5 = element("i");
    			t70 = text("\r\n        Example 1\r\n        ");
    			br6 = element("br");
    			t71 = space();
    			div32 = element("div");
    			create_component(codeexecutor4.$$.fragment);
    			t72 = space();
    			div33 = element("div");
    			p9 = element("p");
    			p9.textContent = "Explanation";
    			t74 = space();
    			p10 = element("p");
    			t75 = text("First line is used to traverse inside\r\n          ");
    			span11 = element("span");
    			span11.textContent = "employees";
    			t77 = text("\r\n          array.\r\n          ");
    			br7 = element("br");
    			t78 = text("\r\n          In the second line the query is checking whether the maximum value of\r\n          the property\r\n          ");
    			span12 = element("span");
    			span12.textContent = "salary";
    			t80 = text("\r\n          is equal to\r\n          ");
    			span13 = element("span");
    			span13.textContent = "70000";
    			t82 = text("\r\n          .");
    			t83 = space();
    			div44 = element("div");
    			div37 = element("div");
    			div37.textContent = "$min";
    			t85 = space();
    			div38 = element("div");
    			t86 = space();
    			div43 = element("div");
    			div42 = element("div");
    			div39 = element("div");
    			i6 = element("i");
    			t87 = text("\r\n        Example 1\r\n        ");
    			br8 = element("br");
    			t88 = space();
    			div40 = element("div");
    			create_component(codeexecutor5.$$.fragment);
    			t89 = space();
    			div41 = element("div");
    			p11 = element("p");
    			p11.textContent = "Explanation";
    			t91 = space();
    			p12 = element("p");
    			t92 = text("First line is used to traverse inside\r\n          ");
    			span14 = element("span");
    			span14.textContent = "employees";
    			t94 = text("\r\n          array.\r\n          ");
    			br9 = element("br");
    			t95 = text("\r\n          In the second line the query is checking whether the minimum value of\r\n          the property\r\n          ");
    			span15 = element("span");
    			span15.textContent = "salary";
    			t97 = text("\r\n          is equal to\r\n          ");
    			span16 = element("span");
    			span16.textContent = "60000";
    			t99 = text("\r\n          .");
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$7, 8, 0, 184);
    			attr_dev(div1, "class", "heading");
    			add_location(div1, file$7, 11, 2, 272);
    			attr_dev(i0, "class", "fas fa-check");
    			add_location(i0, file$7, 16, 8, 397);
    			add_location(br0, file$7, 18, 8, 452);
    			attr_dev(div2, "class", "title");
    			add_location(div2, file$7, 15, 6, 368);
    			attr_dev(div3, "class", "ce");
    			add_location(div3, file$7, 20, 6, 480);
    			attr_dev(p0, "class", "title");
    			add_location(p0, file$7, 24, 8, 636);
    			attr_dev(span0, "class", "span_style");
    			add_location(span0, file$7, 27, 10, 753);
    			attr_dev(span1, "class", "span_style");
    			add_location(span1, file$7, 29, 10, 821);
    			add_location(p1, file$7, 25, 8, 678);
    			attr_dev(div4, "class", "explanation");
    			add_location(div4, file$7, 23, 6, 601);
    			attr_dev(i1, "class", "fas fa-check");
    			add_location(i1, file$7, 35, 8, 934);
    			add_location(br1, file$7, 37, 8, 989);
    			attr_dev(div5, "class", "title");
    			add_location(div5, file$7, 34, 6, 905);
    			attr_dev(div6, "class", "ce");
    			add_location(div6, file$7, 39, 6, 1017);
    			attr_dev(p2, "class", "title");
    			add_location(p2, file$7, 45, 8, 1196);
    			attr_dev(span2, "class", "span_style");
    			add_location(span2, file$7, 48, 10, 1313);
    			attr_dev(span3, "class", "span_style");
    			add_location(span3, file$7, 50, 10, 1388);
    			attr_dev(span4, "class", "span_style");
    			add_location(span4, file$7, 52, 10, 1463);
    			add_location(p3, file$7, 46, 8, 1238);
    			attr_dev(div7, "class", "explanation");
    			add_location(div7, file$7, 44, 6, 1161);
    			attr_dev(i2, "class", "fas fa-asterisk");
    			add_location(i2, file$7, 59, 10, 1611);
    			attr_dev(div8, "class", "note_style");
    			add_location(div8, file$7, 58, 8, 1575);
    			add_location(p4, file$7, 62, 8, 1682);
    			attr_dev(div9, "class", "note");
    			add_location(div9, file$7, 57, 6, 1547);
    			attr_dev(div10, "class", "example");
    			add_location(div10, file$7, 14, 4, 339);
    			attr_dev(div11, "class", "examples");
    			add_location(div11, file$7, 13, 2, 311);
    			attr_dev(div12, "class", "Example_block first");
    			add_location(div12, file$7, 10, 0, 235);
    			attr_dev(div13, "class", "heading");
    			add_location(div13, file$7, 75, 2, 1887);
    			attr_dev(div14, "class", "discription");
    			add_location(div14, file$7, 76, 2, 1922);
    			attr_dev(i3, "class", "fas fa-check");
    			add_location(i3, file$7, 80, 8, 2039);
    			add_location(br2, file$7, 82, 8, 2094);
    			attr_dev(div15, "class", "title");
    			add_location(div15, file$7, 79, 6, 2010);
    			attr_dev(div16, "class", "ce");
    			add_location(div16, file$7, 84, 6, 2122);
    			attr_dev(p5, "class", "title");
    			add_location(p5, file$7, 88, 8, 2274);
    			attr_dev(span5, "class", "span_style");
    			add_location(span5, file$7, 91, 10, 2380);
    			add_location(br3, file$7, 93, 10, 2451);
    			attr_dev(span6, "class", "span_style");
    			add_location(span6, file$7, 96, 10, 2564);
    			attr_dev(span7, "class", "span_style");
    			add_location(span7, file$7, 98, 10, 2637);
    			add_location(p6, file$7, 89, 8, 2316);
    			attr_dev(div17, "class", "explanation");
    			add_location(div17, file$7, 87, 6, 2239);
    			attr_dev(div18, "class", "example");
    			add_location(div18, file$7, 78, 4, 1981);
    			attr_dev(div19, "class", "examples");
    			add_location(div19, file$7, 77, 2, 1953);
    			attr_dev(div20, "class", "Example_block");
    			add_location(div20, file$7, 74, 0, 1856);
    			attr_dev(div21, "class", "heading");
    			add_location(div21, file$7, 108, 2, 2783);
    			attr_dev(div22, "class", "discription");
    			add_location(div22, file$7, 109, 2, 2818);
    			attr_dev(i4, "class", "fas fa-check");
    			add_location(i4, file$7, 113, 8, 2935);
    			add_location(br4, file$7, 115, 8, 2990);
    			attr_dev(div23, "class", "title");
    			add_location(div23, file$7, 112, 6, 2906);
    			attr_dev(div24, "class", "ce");
    			add_location(div24, file$7, 117, 6, 3018);
    			attr_dev(p7, "class", "title");
    			add_location(p7, file$7, 121, 8, 3170);
    			attr_dev(span8, "class", "span_style");
    			add_location(span8, file$7, 124, 10, 3276);
    			add_location(br5, file$7, 126, 10, 3347);
    			attr_dev(span9, "class", "span_style");
    			add_location(span9, file$7, 129, 10, 3464);
    			attr_dev(span10, "class", "span_style");
    			add_location(span10, file$7, 131, 10, 3537);
    			add_location(p8, file$7, 122, 8, 3212);
    			attr_dev(div25, "class", "explanation");
    			add_location(div25, file$7, 120, 6, 3135);
    			attr_dev(div26, "class", "example");
    			add_location(div26, file$7, 111, 4, 2877);
    			attr_dev(div27, "class", "examples");
    			add_location(div27, file$7, 110, 2, 2849);
    			attr_dev(div28, "class", "Example_block");
    			add_location(div28, file$7, 107, 0, 2752);
    			attr_dev(div29, "class", "heading");
    			add_location(div29, file$7, 141, 2, 3682);
    			attr_dev(div30, "class", "discription");
    			add_location(div30, file$7, 142, 2, 3717);
    			attr_dev(i5, "class", "fas fa-check");
    			add_location(i5, file$7, 146, 8, 3834);
    			add_location(br6, file$7, 148, 8, 3889);
    			attr_dev(div31, "class", "title");
    			add_location(div31, file$7, 145, 6, 3805);
    			attr_dev(div32, "class", "ce");
    			add_location(div32, file$7, 150, 6, 3917);
    			attr_dev(p9, "class", "title");
    			add_location(p9, file$7, 154, 8, 4069);
    			attr_dev(span11, "class", "span_style");
    			add_location(span11, file$7, 157, 10, 4175);
    			add_location(br7, file$7, 159, 10, 4246);
    			attr_dev(span12, "class", "span_style");
    			add_location(span12, file$7, 162, 10, 4369);
    			attr_dev(span13, "class", "span_style");
    			add_location(span13, file$7, 164, 10, 4442);
    			add_location(p10, file$7, 155, 8, 4111);
    			attr_dev(div33, "class", "explanation");
    			add_location(div33, file$7, 153, 6, 4034);
    			attr_dev(div34, "class", "example");
    			add_location(div34, file$7, 144, 4, 3776);
    			attr_dev(div35, "class", "examples");
    			add_location(div35, file$7, 143, 2, 3748);
    			attr_dev(div36, "class", "Example_block");
    			add_location(div36, file$7, 140, 0, 3651);
    			attr_dev(div37, "class", "heading");
    			add_location(div37, file$7, 174, 2, 4587);
    			attr_dev(div38, "class", "discription");
    			add_location(div38, file$7, 175, 2, 4622);
    			attr_dev(i6, "class", "fas fa-check");
    			add_location(i6, file$7, 179, 8, 4739);
    			add_location(br8, file$7, 181, 8, 4794);
    			attr_dev(div39, "class", "title");
    			add_location(div39, file$7, 178, 6, 4710);
    			attr_dev(div40, "class", "ce");
    			add_location(div40, file$7, 183, 6, 4822);
    			attr_dev(p11, "class", "title");
    			add_location(p11, file$7, 187, 8, 4974);
    			attr_dev(span14, "class", "span_style");
    			add_location(span14, file$7, 190, 10, 5080);
    			add_location(br9, file$7, 192, 10, 5151);
    			attr_dev(span15, "class", "span_style");
    			add_location(span15, file$7, 195, 10, 5274);
    			attr_dev(span16, "class", "span_style");
    			add_location(span16, file$7, 197, 10, 5347);
    			add_location(p12, file$7, 188, 8, 5016);
    			attr_dev(div41, "class", "explanation");
    			add_location(div41, file$7, 186, 6, 4939);
    			attr_dev(div42, "class", "example");
    			add_location(div42, file$7, 177, 4, 4681);
    			attr_dev(div43, "class", "examples");
    			add_location(div43, file$7, 176, 2, 4653);
    			attr_dev(div44, "class", "Example_block");
    			add_location(div44, file$7, 173, 0, 4556);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div1);
    			append_dev(div12, t3);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div2);
    			append_dev(div2, i0);
    			append_dev(div2, t4);
    			append_dev(div2, br0);
    			append_dev(div10, t5);
    			append_dev(div10, div3);
    			mount_component(codeexecutor0, div3, null);
    			append_dev(div10, t6);
    			append_dev(div10, div4);
    			append_dev(div4, p0);
    			append_dev(div4, t8);
    			append_dev(div4, p1);
    			append_dev(p1, t9);
    			append_dev(p1, span0);
    			append_dev(p1, t11);
    			append_dev(p1, span1);
    			append_dev(p1, t13);
    			append_dev(div10, t14);
    			append_dev(div10, div5);
    			append_dev(div5, i1);
    			append_dev(div5, t15);
    			append_dev(div5, br1);
    			append_dev(div10, t16);
    			append_dev(div10, div6);
    			mount_component(codeexecutor1, div6, null);
    			append_dev(div10, t17);
    			append_dev(div10, div7);
    			append_dev(div7, p2);
    			append_dev(div7, t19);
    			append_dev(div7, p3);
    			append_dev(p3, t20);
    			append_dev(p3, span2);
    			append_dev(p3, t22);
    			append_dev(p3, span3);
    			append_dev(p3, t24);
    			append_dev(p3, span4);
    			append_dev(p3, t26);
    			append_dev(div10, t27);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, i2);
    			append_dev(div8, t28);
    			append_dev(div9, t29);
    			append_dev(div9, p4);
    			append_dev(div9, t31);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div13);
    			append_dev(div20, t34);
    			append_dev(div20, div14);
    			append_dev(div20, t35);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div18, div15);
    			append_dev(div15, i3);
    			append_dev(div15, t36);
    			append_dev(div15, br2);
    			append_dev(div18, t37);
    			append_dev(div18, div16);
    			mount_component(codeexecutor2, div16, null);
    			append_dev(div18, t38);
    			append_dev(div18, div17);
    			append_dev(div17, p5);
    			append_dev(div17, t40);
    			append_dev(div17, p6);
    			append_dev(p6, t41);
    			append_dev(p6, span5);
    			append_dev(p6, t43);
    			append_dev(p6, br3);
    			append_dev(p6, t44);
    			append_dev(p6, span6);
    			append_dev(p6, t46);
    			append_dev(p6, span7);
    			append_dev(p6, t48);
    			insert_dev(target, t49, anchor);
    			insert_dev(target, div28, anchor);
    			append_dev(div28, div21);
    			append_dev(div28, t51);
    			append_dev(div28, div22);
    			append_dev(div28, t52);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div26, div23);
    			append_dev(div23, i4);
    			append_dev(div23, t53);
    			append_dev(div23, br4);
    			append_dev(div26, t54);
    			append_dev(div26, div24);
    			mount_component(codeexecutor3, div24, null);
    			append_dev(div26, t55);
    			append_dev(div26, div25);
    			append_dev(div25, p7);
    			append_dev(div25, t57);
    			append_dev(div25, p8);
    			append_dev(p8, t58);
    			append_dev(p8, span8);
    			append_dev(p8, t60);
    			append_dev(p8, br5);
    			append_dev(p8, t61);
    			append_dev(p8, span9);
    			append_dev(p8, t63);
    			append_dev(p8, span10);
    			append_dev(p8, t65);
    			insert_dev(target, t66, anchor);
    			insert_dev(target, div36, anchor);
    			append_dev(div36, div29);
    			append_dev(div36, t68);
    			append_dev(div36, div30);
    			append_dev(div36, t69);
    			append_dev(div36, div35);
    			append_dev(div35, div34);
    			append_dev(div34, div31);
    			append_dev(div31, i5);
    			append_dev(div31, t70);
    			append_dev(div31, br6);
    			append_dev(div34, t71);
    			append_dev(div34, div32);
    			mount_component(codeexecutor4, div32, null);
    			append_dev(div34, t72);
    			append_dev(div34, div33);
    			append_dev(div33, p9);
    			append_dev(div33, t74);
    			append_dev(div33, p10);
    			append_dev(p10, t75);
    			append_dev(p10, span11);
    			append_dev(p10, t77);
    			append_dev(p10, br7);
    			append_dev(p10, t78);
    			append_dev(p10, span12);
    			append_dev(p10, t80);
    			append_dev(p10, span13);
    			append_dev(p10, t82);
    			insert_dev(target, t83, anchor);
    			insert_dev(target, div44, anchor);
    			append_dev(div44, div37);
    			append_dev(div44, t85);
    			append_dev(div44, div38);
    			append_dev(div44, t86);
    			append_dev(div44, div43);
    			append_dev(div43, div42);
    			append_dev(div42, div39);
    			append_dev(div39, i6);
    			append_dev(div39, t87);
    			append_dev(div39, br8);
    			append_dev(div42, t88);
    			append_dev(div42, div40);
    			mount_component(codeexecutor5, div40, null);
    			append_dev(div42, t89);
    			append_dev(div42, div41);
    			append_dev(div41, p11);
    			append_dev(div41, t91);
    			append_dev(div41, p12);
    			append_dev(p12, t92);
    			append_dev(p12, span14);
    			append_dev(p12, t94);
    			append_dev(p12, br9);
    			append_dev(p12, t95);
    			append_dev(p12, span15);
    			append_dev(p12, t97);
    			append_dev(p12, span16);
    			append_dev(p12, t99);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const codeexecutor0_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes.json = /*$examples*/ ctx[0].count.json;
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes._rjql = /*$examples*/ ctx[0].count.rjql;
    			codeexecutor0.$set(codeexecutor0_changes);
    			const codeexecutor1_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes.json = /*$examples*/ ctx[0].count.json;
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes._rjql = /*$examples*/ ctx[0].count1.rjql;
    			codeexecutor1.$set(codeexecutor1_changes);
    			const codeexecutor2_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor2_changes.json = /*$examples*/ ctx[0].sum.json;
    			if (dirty & /*$examples*/ 1) codeexecutor2_changes._rjql = /*$examples*/ ctx[0].sum.rjql;
    			codeexecutor2.$set(codeexecutor2_changes);
    			const codeexecutor3_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor3_changes.json = /*$examples*/ ctx[0].avg.json;
    			if (dirty & /*$examples*/ 1) codeexecutor3_changes._rjql = /*$examples*/ ctx[0].avg.rjql;
    			codeexecutor3.$set(codeexecutor3_changes);
    			const codeexecutor4_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor4_changes.json = /*$examples*/ ctx[0].max.json;
    			if (dirty & /*$examples*/ 1) codeexecutor4_changes._rjql = /*$examples*/ ctx[0].max.rjql;
    			codeexecutor4.$set(codeexecutor4_changes);
    			const codeexecutor5_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor5_changes.json = /*$examples*/ ctx[0].min.json;
    			if (dirty & /*$examples*/ 1) codeexecutor5_changes._rjql = /*$examples*/ ctx[0].min.rjql;
    			codeexecutor5.$set(codeexecutor5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(codeexecutor0.$$.fragment, local);
    			transition_in(codeexecutor1.$$.fragment, local);
    			transition_in(codeexecutor2.$$.fragment, local);
    			transition_in(codeexecutor3.$$.fragment, local);
    			transition_in(codeexecutor4.$$.fragment, local);
    			transition_in(codeexecutor5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(codeexecutor0.$$.fragment, local);
    			transition_out(codeexecutor1.$$.fragment, local);
    			transition_out(codeexecutor2.$$.fragment, local);
    			transition_out(codeexecutor3.$$.fragment, local);
    			transition_out(codeexecutor4.$$.fragment, local);
    			transition_out(codeexecutor5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div12);
    			destroy_component(codeexecutor0);
    			destroy_component(codeexecutor1);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(div20);
    			destroy_component(codeexecutor2);
    			if (detaching) detach_dev(t49);
    			if (detaching) detach_dev(div28);
    			destroy_component(codeexecutor3);
    			if (detaching) detach_dev(t66);
    			if (detaching) detach_dev(div36);
    			destroy_component(codeexecutor4);
    			if (detaching) detach_dev(t83);
    			if (detaching) detach_dev(div44);
    			destroy_component(codeexecutor5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $examples;
    	validate_store(examples, "examples");
    	component_subscribe($$self, examples, $$value => $$invalidate(0, $examples = $$value));

    	onMount(() => {
    		
    	});

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$examples" in $$props) examples.set($examples = $$props.$examples);
    	};

    	return [$examples];
    }

    class AggregationFunction extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AggregationFunction",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\Home.svelte generated by Svelte v3.18.1 */
    const file$8 = "src\\Home.svelte";

    function create_fragment$8(ctx) {
    	let div0;
    	let t1;
    	let div6;
    	let div1;
    	let t3;
    	let div5;
    	let div2;
    	let t4;
    	let t5;
    	let div3;

    	let t6_value = (/*exampleTitle*/ ctx[0]
    	? /*exampleTitle*/ ctx[0]
    	: "sample") + "";

    	let t6;
    	let t7;
    	let div4;
    	let t9;
    	let div9;
    	let div7;
    	let t11;
    	let div8;
    	let current;

    	const codeexecutor = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[1].uuid.json,
    				_rjql: /*$examples*/ ctx[1].uuid.rjql,
    				maxLines: "15",
    				eid1: /*jsonEditorId*/ ctx[2],
    				eid2: /*rjqlEditorId*/ ctx[3],
    				showRun: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "About";
    			t1 = space();
    			div6 = element("div");
    			div1 = element("div");
    			div1.textContent = "JSON Query Language & Validator";
    			t3 = space();
    			div5 = element("div");
    			div2 = element("div");
    			t4 = space();
    			create_component(codeexecutor.$$.fragment);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div4 = element("div");
    			div4.textContent = "RJQL";
    			t9 = space();
    			div9 = element("div");
    			div7 = element("div");
    			div7.textContent = "Its concise & effective";
    			t11 = space();
    			div8 = element("div");
    			div8.textContent = "Try REPL now";
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$8, 115, 0, 2427);
    			attr_dev(div1, "class", "hero svelte-1klcqvj");
    			add_location(div1, file$8, 118, 2, 2500);
    			attr_dev(div2, "class", "wrapper svelte-1klcqvj");
    			add_location(div2, file$8, 120, 4, 2591);
    			attr_dev(div3, "class", "example-title svelte-1klcqvj");
    			add_location(div3, file$8, 128, 4, 2809);
    			attr_dev(div4, "class", "rjql-logo svelte-1klcqvj");
    			add_location(div4, file$8, 129, 4, 2888);
    			attr_dev(div5, "class", "home-editors svelte-1klcqvj");
    			add_location(div5, file$8, 119, 2, 2559);
    			attr_dev(div6, "class", "Example_block first");
    			add_location(div6, file$8, 117, 0, 2463);
    			attr_dev(div7, "class", "hero svelte-1klcqvj");
    			add_location(div7, file$8, 134, 4, 3003);
    			attr_dev(div8, "class", "hero svelte-1klcqvj");
    			set_style(div8, "margin-top", "40px");
    			add_location(div8, file$8, 136, 4, 3058);
    			attr_dev(div9, "class", "Example_block ");
    			set_style(div9, "margin-top", "40px");
    			add_location(div9, file$8, 133, 0, 2943);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div5, t4);
    			mount_component(codeexecutor, div5, null);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div3, t6);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div7);
    			append_dev(div9, t11);
    			append_dev(div9, div8);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const codeexecutor_changes = {};
    			if (dirty & /*$examples*/ 2) codeexecutor_changes.json = /*$examples*/ ctx[1].uuid.json;
    			if (dirty & /*$examples*/ 2) codeexecutor_changes._rjql = /*$examples*/ ctx[1].uuid.rjql;
    			codeexecutor.$set(codeexecutor_changes);

    			if ((!current || dirty & /*exampleTitle*/ 1) && t6_value !== (t6_value = (/*exampleTitle*/ ctx[0]
    			? /*exampleTitle*/ ctx[0]
    			: "sample") + "")) set_data_dev(t6, t6_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(codeexecutor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(codeexecutor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div6);
    			destroy_component(codeexecutor);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $examples;
    	let $menu;
    	let $runRJQL;
    	validate_store(examples, "examples");
    	component_subscribe($$self, examples, $$value => $$invalidate(1, $examples = $$value));
    	validate_store(menu, "menu");
    	component_subscribe($$self, menu, $$value => $$invalidate(8, $menu = $$value));
    	validate_store(runRJQL, "runRJQL");
    	component_subscribe($$self, runRJQL, $$value => $$invalidate(9, $runRJQL = $$value));
    	var jsonEditorId = "home-json-editor";
    	var rjqlEditorId = "home-rjql-editor";
    	var jsonES;
    	var rjqlES;
    	var exampleTitle;
    	var keys = Object.keys($examples);
    	var index = 0;
    	var rjqlIndex = 0;

    	onMount(() => {
    		setTimeout(playExamples, 1000);
    	});

    	function playExamples() {
    		jsonES = window[jsonEditorId].getSession();
    		rjqlES = window[rjqlEditorId].getSession();
    		start();
    	}

    	function start() {
    		var key = keys[index];

    		if (!key) {
    			index = 0;
    			start();
    		} else {
    			$$invalidate(0, exampleTitle = key.replace("_", "").replace(/\d+/g, ""));
    			var o = $examples[key];
    			jsonES.setValue(o.json);
    			rjqlIndex = 0;
    			rjqlES.setValue("");
    			writeRJQL(o.rjql);
    		}
    	}

    	function writeRJQL(rjql) {
    		if ($menu != 0) {
    			return;
    		}

    		setTimeout(
    			() => {
    				rjqlES.setValue(rjqlES.getValue() + rjql[rjqlIndex]);
    				rjqlIndex++;

    				if (rjqlIndex == rjql.length) {
    					set_store_value(runRJQL, $runRJQL = Math.random());

    					setTimeout(
    						() => {
    							index++;
    							start();
    						},
    						2000
    					);
    				} else {
    					set_store_value(runRJQL, $runRJQL = Math.random());

    					setTimeout(
    						() => {
    							writeRJQL(rjql);
    						},
    						70
    					);
    				}
    			},
    			10
    		);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("jsonEditorId" in $$props) $$invalidate(2, jsonEditorId = $$props.jsonEditorId);
    		if ("rjqlEditorId" in $$props) $$invalidate(3, rjqlEditorId = $$props.rjqlEditorId);
    		if ("jsonES" in $$props) jsonES = $$props.jsonES;
    		if ("rjqlES" in $$props) rjqlES = $$props.rjqlES;
    		if ("exampleTitle" in $$props) $$invalidate(0, exampleTitle = $$props.exampleTitle);
    		if ("keys" in $$props) keys = $$props.keys;
    		if ("index" in $$props) index = $$props.index;
    		if ("rjqlIndex" in $$props) rjqlIndex = $$props.rjqlIndex;
    		if ("$examples" in $$props) examples.set($examples = $$props.$examples);
    		if ("$menu" in $$props) menu.set($menu = $$props.$menu);
    		if ("$runRJQL" in $$props) runRJQL.set($runRJQL = $$props.$runRJQL);
    	};

    	return [exampleTitle, $examples, jsonEditorId, rjqlEditorId];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\Usage.svelte generated by Svelte v3.18.1 */
    const file$9 = "src\\Usage.svelte";

    function create_fragment$9(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div16;
    	let div2;
    	let t4;
    	let div7;
    	let div4;
    	let div3;
    	let t6;
    	let t7;
    	let div6;
    	let div5;
    	let t9;
    	let t10;
    	let div10;
    	let div8;
    	let t12;
    	let div9;
    	let t14;
    	let div11;
    	let a0;
    	let i0;
    	let t15;
    	let span0;
    	let t17;
    	let i1;
    	let t18;
    	let div14;
    	let div12;
    	let t20;
    	let div13;
    	let t22;
    	let div15;
    	let a1;
    	let i2;
    	let t23;
    	let span1;
    	let t25;
    	let i3;
    	let current;

    	const editor0 = new Editor({
    			props: {
    				val: /*val*/ ctx[1],
    				eid: /*eid*/ ctx[0],
    				mode: "html",
    				maxLines: "20"
    			},
    			$$inline: true
    		});

    	const editor1 = new Editor({
    			props: {
    				val: /*op*/ ctx[2],
    				eid: "output",
    				mode: "javascript",
    				maxLines: "15"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Usage";
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div16 = element("div");
    			div2 = element("div");
    			div2.textContent = "Embed RJQL to test your JSON Data";
    			t4 = space();
    			div7 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div3.textContent = "Embed";
    			t6 = space();
    			create_component(editor0.$$.fragment);
    			t7 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div5.textContent = "Output";
    			t9 = space();
    			create_component(editor1.$$.fragment);
    			t10 = space();
    			div10 = element("div");
    			div8 = element("div");
    			div8.textContent = "#sahir";
    			t12 = space();
    			div9 = element("div");
    			div9.textContent = "29 May, 20";
    			t14 = space();
    			div11 = element("div");
    			a0 = element("a");
    			i0 = element("i");
    			t15 = space();
    			span0 = element("span");
    			span0.textContent = "rjql.sahir.min.js";
    			t17 = space();
    			i1 = element("i");
    			t18 = space();
    			div14 = element("div");
    			div12 = element("div");
    			div12.textContent = "#manto";
    			t20 = space();
    			div13 = element("div");
    			div13.textContent = "20 Feb, 20";
    			t22 = space();
    			div15 = element("div");
    			a1 = element("a");
    			i2 = element("i");
    			t23 = space();
    			span1 = element("span");
    			span1.textContent = "rjql.manto.min.js";
    			t25 = space();
    			i3 = element("i");
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$9, 86, 0, 1505);
    			set_style(div1, "height", "50px");
    			add_location(div1, file$9, 88, 0, 1541);
    			attr_dev(div2, "class", "hero svelte-1i8eo35");
    			add_location(div2, file$9, 91, 0, 1597);
    			attr_dev(div3, "class", "ed-hdr svelte-1i8eo35");
    			add_location(div3, file$9, 94, 6, 1706);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$9, 93, 4, 1681);
    			attr_dev(div5, "class", "ed-hdr svelte-1i8eo35");
    			add_location(div5, file$9, 98, 6, 1864);
    			attr_dev(div6, "class", "col");
    			set_style(div6, "position", "relative");
    			add_location(div6, file$9, 97, 4, 1811);
    			attr_dev(div7, "class", "row");
    			add_location(div7, file$9, 92, 2, 1658);
    			attr_dev(div8, "class", "ver svelte-1i8eo35");
    			add_location(div8, file$9, 104, 4, 2030);
    			attr_dev(div9, "class", "release svelte-1i8eo35");
    			add_location(div9, file$9, 105, 4, 2065);
    			attr_dev(div10, "class", "version-header svelte-1i8eo35");
    			add_location(div10, file$9, 103, 2, 1996);
    			attr_dev(i0, "class", "fab fa-js-square");
    			add_location(i0, file$9, 109, 6, 2194);
    			set_style(span0, "font-weight", "600");
    			add_location(span0, file$9, 110, 6, 2232);
    			attr_dev(i1, "class", "fas fa-download");
    			add_location(i1, file$9, 110, 62, 2288);
    			attr_dev(a0, "href", "/release/rjql.sahir.min.js");
    			attr_dev(a0, "download", "");
    			add_location(a0, file$9, 108, 4, 2140);
    			attr_dev(div11, "class", "file svelte-1i8eo35");
    			add_location(div11, file$9, 107, 2, 2116);
    			attr_dev(div12, "class", "ver svelte-1i8eo35");
    			add_location(div12, file$9, 115, 4, 2379);
    			attr_dev(div13, "class", "release svelte-1i8eo35");
    			add_location(div13, file$9, 116, 4, 2414);
    			attr_dev(div14, "class", "version-header svelte-1i8eo35");
    			add_location(div14, file$9, 114, 2, 2345);
    			attr_dev(i2, "class", "fab fa-js-square");
    			add_location(i2, file$9, 120, 6, 2543);
    			set_style(span1, "font-weight", "600");
    			add_location(span1, file$9, 121, 6, 2581);
    			attr_dev(i3, "class", "fas fa-download");
    			add_location(i3, file$9, 121, 62, 2637);
    			attr_dev(a1, "href", "/release/rjql.manto.min.js");
    			attr_dev(a1, "download", "");
    			add_location(a1, file$9, 119, 4, 2489);
    			attr_dev(div15, "class", "file svelte-1i8eo35");
    			add_location(div15, file$9, 118, 2, 2465);
    			attr_dev(div16, "class", "wrapper svelte-1i8eo35");
    			add_location(div16, file$9, 90, 0, 1574);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div2);
    			append_dev(div16, t4);
    			append_dev(div16, div7);
    			append_dev(div7, div4);
    			append_dev(div4, div3);
    			append_dev(div4, t6);
    			mount_component(editor0, div4, null);
    			append_dev(div7, t7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div6, t9);
    			mount_component(editor1, div6, null);
    			append_dev(div16, t10);
    			append_dev(div16, div10);
    			append_dev(div10, div8);
    			append_dev(div10, t12);
    			append_dev(div10, div9);
    			append_dev(div16, t14);
    			append_dev(div16, div11);
    			append_dev(div11, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t15);
    			append_dev(a0, span0);
    			append_dev(a0, t17);
    			append_dev(a0, i1);
    			append_dev(div16, t18);
    			append_dev(div16, div14);
    			append_dev(div14, div12);
    			append_dev(div14, t20);
    			append_dev(div14, div13);
    			append_dev(div16, t22);
    			append_dev(div16, div15);
    			append_dev(div15, a1);
    			append_dev(a1, i2);
    			append_dev(a1, t23);
    			append_dev(a1, span1);
    			append_dev(a1, t25);
    			append_dev(a1, i3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editor0.$$.fragment, local);
    			transition_in(editor1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editor0.$$.fragment, local);
    			transition_out(editor1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div16);
    			destroy_component(editor0);
    			destroy_component(editor1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self) {
    	let eid = "embbed-demo";

    	let val = `
\<script src="rjql.sahir.min.js"\>\</script\>
\<script\>
    var json = {
        name: "Sahir",
        famousFor: 'Poetry'
    };

    var qry = 'name = "Sahir"';
    var qry2 = 'name = "Faiz"';

    console.log(rjql.validate(json, qry));
    console.log(rjql.validate(json, qry1));
\</script\>
    `;

    	let op = `[{ 
    errLineNo: 2,
    verb: 'OK',
    passed: true,
    next: '',
    target: { name: 'Sahir', famousFor: 'Poetry' },
    operator: '=' 
}]

[{ 
    errLineNo: 2,
    verb: 'Expected <i>name</i> to be <b>Faiz</b> found <u>Sahir</u>',
    passed: false,
    next: '',
    target: undefined,
    operator: '=' 
}]

//Returns an array of query block results.
`;

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("eid" in $$props) $$invalidate(0, eid = $$props.eid);
    		if ("val" in $$props) $$invalidate(1, val = $$props.val);
    		if ("op" in $$props) $$invalidate(2, op = $$props.op);
    	};

    	return [eid, val, op];
    }

    class Usage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Usage",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\Conjunction.svelte generated by Svelte v3.18.1 */
    const file$a = "src\\Conjunction.svelte";

    function create_fragment$a(ctx) {
    	let div0;
    	let t1;
    	let div7;
    	let div1;
    	let t3;
    	let div6;
    	let div5;
    	let div2;
    	let i0;
    	let t4;
    	let br0;
    	let t5;
    	let div3;
    	let t6;
    	let div4;
    	let p0;
    	let t8;
    	let p1;
    	let t9;
    	let span0;
    	let t11;
    	let span1;
    	let t13;
    	let t14;
    	let div15;
    	let div8;
    	let t16;
    	let div9;
    	let t17;
    	let div14;
    	let div13;
    	let div10;
    	let i1;
    	let t18;
    	let br1;
    	let t19;
    	let div11;
    	let t20;
    	let div12;
    	let p2;
    	let t22;
    	let p3;
    	let t23;
    	let span2;
    	let t25;
    	let span3;
    	let t27;
    	let current;

    	const codeexecutor0 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].and.json,
    				_rjql: /*$examples*/ ctx[0].and.rjql
    			},
    			$$inline: true
    		});

    	const codeexecutor1 = new CodeExecutor({
    			props: {
    				json: /*$examples*/ ctx[0].or.json,
    				_rjql: /*$examples*/ ctx[0].or.rjql
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Conjunction";
    			t1 = space();
    			div7 = element("div");
    			div1 = element("div");
    			div1.textContent = "`&&` - and";
    			t3 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div2 = element("div");
    			i0 = element("i");
    			t4 = text("\r\n        Example\r\n        ");
    			br0 = element("br");
    			t5 = space();
    			div3 = element("div");
    			create_component(codeexecutor0.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			p0 = element("p");
    			p0.textContent = "Explanation";
    			t8 = space();
    			p1 = element("p");
    			t9 = text("Logical  ");
    			span0 = element("span");
    			span0.textContent = "AND";
    			t11 = text(", A && B is \r\n          ");
    			span1 = element("span");
    			span1.textContent = "true";
    			t13 = text(" if both A and B are true.");
    			t14 = space();
    			div15 = element("div");
    			div8 = element("div");
    			div8.textContent = "`||` - or";
    			t16 = space();
    			div9 = element("div");
    			t17 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div10 = element("div");
    			i1 = element("i");
    			t18 = text("\r\n        Example\r\n        ");
    			br1 = element("br");
    			t19 = space();
    			div11 = element("div");
    			create_component(codeexecutor1.$$.fragment);
    			t20 = space();
    			div12 = element("div");
    			p2 = element("p");
    			p2.textContent = "Explanation";
    			t22 = space();
    			p3 = element("p");
    			t23 = text("Logical  ");
    			span2 = element("span");
    			span2.textContent = "OR";
    			t25 = text(", A || B is \r\n          ");
    			span3 = element("span");
    			span3.textContent = "true";
    			t27 = text(" if either of A or B is true.");
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$a, 8, 0, 184);
    			attr_dev(div1, "class", "heading");
    			add_location(div1, file$a, 11, 2, 263);
    			attr_dev(i0, "class", "fas fa-check");
    			add_location(i0, file$a, 16, 8, 392);
    			add_location(br0, file$a, 18, 8, 445);
    			attr_dev(div2, "class", "title");
    			add_location(div2, file$a, 15, 6, 363);
    			attr_dev(div3, "class", "ce");
    			add_location(div3, file$a, 20, 6, 473);
    			attr_dev(p0, "class", "title");
    			add_location(p0, file$a, 24, 8, 625);
    			attr_dev(span0, "class", "span_style");
    			add_location(span0, file$a, 26, 19, 691);
    			attr_dev(span1, "class", "span_style");
    			add_location(span1, file$a, 27, 10, 750);
    			add_location(p1, file$a, 25, 8, 667);
    			attr_dev(div4, "class", "explanation");
    			add_location(div4, file$a, 23, 6, 590);
    			attr_dev(div5, "class", "example");
    			add_location(div5, file$a, 14, 4, 334);
    			attr_dev(div6, "class", "examples");
    			add_location(div6, file$a, 13, 2, 306);
    			attr_dev(div7, "class", "Example_block first");
    			add_location(div7, file$a, 10, 0, 226);
    			attr_dev(div8, "class", "heading");
    			add_location(div8, file$a, 39, 2, 918);
    			attr_dev(div9, "class", "discription");
    			add_location(div9, file$a, 40, 2, 958);
    			attr_dev(i1, "class", "fas fa-check");
    			add_location(i1, file$a, 44, 8, 1075);
    			add_location(br1, file$a, 46, 8, 1128);
    			attr_dev(div10, "class", "title");
    			add_location(div10, file$a, 43, 6, 1046);
    			attr_dev(div11, "class", "ce");
    			add_location(div11, file$a, 48, 6, 1156);
    			attr_dev(p2, "class", "title");
    			add_location(p2, file$a, 52, 8, 1306);
    			attr_dev(span2, "class", "span_style");
    			add_location(span2, file$a, 54, 19, 1372);
    			attr_dev(span3, "class", "span_style");
    			add_location(span3, file$a, 55, 10, 1430);
    			add_location(p3, file$a, 53, 8, 1348);
    			attr_dev(div12, "class", "explanation");
    			add_location(div12, file$a, 51, 6, 1271);
    			attr_dev(div13, "class", "example");
    			add_location(div13, file$a, 42, 4, 1017);
    			attr_dev(div14, "class", "examples");
    			add_location(div14, file$a, 41, 2, 989);
    			attr_dev(div15, "class", "Example_block");
    			add_location(div15, file$a, 38, 0, 887);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div1);
    			append_dev(div7, t3);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, i0);
    			append_dev(div2, t4);
    			append_dev(div2, br0);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			mount_component(codeexecutor0, div3, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, p0);
    			append_dev(div4, t8);
    			append_dev(div4, p1);
    			append_dev(p1, t9);
    			append_dev(p1, span0);
    			append_dev(p1, t11);
    			append_dev(p1, span1);
    			append_dev(p1, t13);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div8);
    			append_dev(div15, t16);
    			append_dev(div15, div9);
    			append_dev(div15, t17);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div10);
    			append_dev(div10, i1);
    			append_dev(div10, t18);
    			append_dev(div10, br1);
    			append_dev(div13, t19);
    			append_dev(div13, div11);
    			mount_component(codeexecutor1, div11, null);
    			append_dev(div13, t20);
    			append_dev(div13, div12);
    			append_dev(div12, p2);
    			append_dev(div12, t22);
    			append_dev(div12, p3);
    			append_dev(p3, t23);
    			append_dev(p3, span2);
    			append_dev(p3, t25);
    			append_dev(p3, span3);
    			append_dev(p3, t27);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const codeexecutor0_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes.json = /*$examples*/ ctx[0].and.json;
    			if (dirty & /*$examples*/ 1) codeexecutor0_changes._rjql = /*$examples*/ ctx[0].and.rjql;
    			codeexecutor0.$set(codeexecutor0_changes);
    			const codeexecutor1_changes = {};
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes.json = /*$examples*/ ctx[0].or.json;
    			if (dirty & /*$examples*/ 1) codeexecutor1_changes._rjql = /*$examples*/ ctx[0].or.rjql;
    			codeexecutor1.$set(codeexecutor1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(codeexecutor0.$$.fragment, local);
    			transition_in(codeexecutor1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(codeexecutor0.$$.fragment, local);
    			transition_out(codeexecutor1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div7);
    			destroy_component(codeexecutor0);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div15);
    			destroy_component(codeexecutor1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $examples;
    	validate_store(examples, "examples");
    	component_subscribe($$self, examples, $$value => $$invalidate(0, $examples = $$value));

    	onMount(() => {
    		
    	});

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$examples" in $$props) examples.set($examples = $$props.$examples);
    	};

    	return [$examples];
    }

    class Conjunction extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Conjunction",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    let aggip = `{
	"data": {
		"employees": [{
				"name": "John",
				"age": 30,
				"salary": 70000,
				"department": "Software"
			},
			{
				"name": "Harry",
				"age": "25",
				"salary": 60000,
				"department": "Admin"
			}

		]
	}
}`;

    let sort_ex = `{
    "name":"John",
    "age":30,
    "cars":[ "BMW", "Fiat", "Ford" ]
}`;


    let common = `{
    "data": {
       "name": "John",
        "age": 30,
        "cars": [
            {
                "property": [
                    {
                        "color": "white",
                        "model": "LeafPlus",
                        "fuelType": "electric"
                    }
                 ],
                    "company": "Nissan",
                    "id": "AA97B177-9383-4934-8543-0F91A7A02836"
                },
            {
                "property": [
                    {
                        "color": "red",
                        "model": "Z4",
                        "fuelType": "diesel"
                    }
                ],
                    "company": "BMW",
                    "id": "BA97B177-9124-4934-8786-0F91A7C6754"
                }
            ]
       }
    }`;


    let in_2_ex = `{
    "name":"John",
    "age":30,
    "cars":[ "Ford", "BMW", "Fiat" ]
}`;


    let conj_json = `{
    "data": {
        "tgsvUniqueKey": "weywevwewe",
        "source": "TGSV",
        "type": "tcu2k",
        "version": "1.0.0",
        "dataFields": [
            {
                "series": [
                    {
                        "timeStamp": "2019-08-18T23:59:56",
                        "triggerOrContextName": "StatusData",
                        "type": "LKCD",
                        "value": "2019-08-18T23:59:56"
                    }
                ],
                "name": "MsnAcquisitionDate"
            },
            {
                "series": [
                    {
                        "timeStamp": "2019-08-19T00:00:15.000Z",
                        "triggerOrContextName": "StatusData",
                        "type": "LKCD",
                        "value": "The Vehicle Battery is low!!!"
                    }
                ],
                "name": "MapVersion64Byte_Upper16Byte"
            },
            {
                "series": [
                    {
                        "timeStamp": "2019-08-19T00:00:15.000Z",
                        "triggerOrContextName": "StatusData",
                        "type": "LKCD",
                        "value": "Less fuel!!!"
                    }
                ],
                "name": "MsnAcquisition"
            }
        ],
        "vin": "wrerqwer45qwqwr45",
        "tcu_gen": "TCU2K",
        "platform_name": "gamma",
        "event_occur_timeStamp": "2019-08-19T00:00:15.000Z",
        "event_arrival_timeStamp": "2020-01-06T05:59:19.273Z"
    }
}`;


    function initExamples($examples) {
        setCountExample($examples);
        setSumExample($examples);
        setAvgExample($examples);
        setMaxExample($examples);
        setMinExample($examples);
        setsortExample($examples);
        setUUIDExample($examples);
        setregexExample($examples);
        setinExample($examples);
        setIPExample($examples);
        setArraysExample($examples);
        setSingleValuesExample($examples);
        setConjuctionExample($examples);
    }

    function setCountExample($examples) {
        $examples["count"] = {};

        $examples.count.json = aggip;

        $examples["count1"] = {};


        $examples.count1.json = aggip;
        $examples.count.rjql = ` data>employees[]:
    $count{department} = "2"`;

        $examples.count1.rjql = ` data>employees[]:
    $count{department:/Software/} = 1`;
    }

    function setSumExample($examples) {

        $examples["sum"] = {};
        $examples.sum.json = aggip;
        $examples.sum.rjql = ` data>employees[]:
    $sum{salary} = 130000`;
    }

    function setAvgExample($examples) {

        $examples["avg"] = {};
        $examples.avg.json = aggip;
        $examples.avg.rjql = ` data>employees[]:
    $avg{salary} = 65000`;
    }

    function setMaxExample($examples) {

        $examples["max"] = {};
        $examples.max.json = aggip;
        $examples.max.rjql = ` data>employees[]:
    $max{salary} = 70000`;
    }

    function setMinExample($examples) {
        $examples["min"] = {};
        $examples.min.json = aggip;
        $examples.min.rjql = ` data>employees[]:
    $min{salary} = 60000`;
    }

    function setsortExample($examples) {
        $examples["sort"] = {};

        $examples.sort.rjql = `cars[] = "$asort"`;
        $examples.sort.json = sort_ex;

        $examples["sort1"] = {};
        $examples.sort1.rjql = ` cars[] = "$dsort"`;
        $examples.sort1.json = sort_ex;
    }

    function setUUIDExample($examples) {
        $examples["uuid"] = {};
        $examples.uuid.rjql = `data>cars[]:
    id = "$uuid"`;
        $examples.uuid.json = common;
    }

    function setregexExample($examples) {
        $examples["regex"] = {};
        $examples.regex.rjql = `data>cars[]:
    company = "BMW"
    property[]:
        model = "$regex{/^[a-z]$/}"`;
        $examples.regex.json = common;
    }

    function setinExample($examples) {
        $examples["in"] = {};

        $examples.in.rjql = `name = "$in{'John'}"`;
        $examples.in.json = in_2_ex;

        $examples["in_2"] = {};
        $examples.in_2.json = in_2_ex;
        $examples.in_2.rjql = ` cars = "$in{'Ford', 'BMW', 'Fiat'}"`;
    }

    function setIPExample($examples) {
        $examples["ip"] = {};

        $examples.ip.json = `[{
        "id": 1,
        "first_name": "Jeanette",
        "last_name": "Penddreth",
        "email": "jpenddreth0@census.gov",
        "gender": "Female",
        "ip_address": "26.58.193.2"
      }, {
        "id": 2,
        "first_name": "Giavani",
        "last_name": "Frediani",
        "email": "gfrediani1@senate.gov",
        "gender": "Male",
        "ip_address": "229.179.4.212"
      }, {
        "id": 3,
        "first_name": "Noell",
        "last_name": "Bea",
        "email": "nbea2@imageshack.us",
        "gender": "Female",
        "ip_address": "180.66.162.255"
      }, {
        "id": 4,
        "first_name": "Willard",
        "last_name": "Valek",
        "email": "wvalek3@vk.com",
        "gender": "Male",
        "ip_address": "67.76.188.26"
      }]`;
        $examples.ip.rjql = `[]:
    ip_address = "$ip"`;
    }


    function setArraysExample($examples) {
        $examples["arrays"] = {};
        $examples.arrays.json = `{
    "name":"John",
    "age":30,
    "cars":[ "Ford", "BMW", "Fiat" ]
}`;
        $examples.arrays.rjql = ` cars[0] = "Ford" `;

        $examples["arrays1"] = {};
        $examples.arrays1.json = `{
   "data": {
    "name": "John",
    "age": 30,
    "cars": [
        {
            "property": [
                {
                    "color": "white",
                    "model": "LeafPlus",
                    "fuelType": "electric"
                }
            ],
                "company": "Nissan",
                "id": "AA97B177-9383-4934-8543-0F91A7A02836"
            },
        {
            "property": [
                {
                    "color": "red",
                    "model": "Z4",
                    "fuelType": "diesel"
                }
            ],
                "company": "BMW",
                "id": "BA97B177-9124-4934-8786-0F91A7C6754"
            }
        ]
    }
}`;

        $examples.arrays1.rjql = ` data>cars[]:
    company = "Nissan"
    property[]:
        model = "LeafPlus" `;
    }


    function setSingleValuesExample($examples) {

        $examples["singlevalues"] = {};
        $examples.singlevalues.json = `{
  "name": "John",
  "age": 30
}`;
        $examples.singlevalues.rjql = ` name = "John" `;

        $examples["singlevalues1"] = {};
        $examples.singlevalues1.json = $examples.singlevalues.json;
        $examples.singlevalues1.rjql = ` age >= 20 `;

        $examples["singlevalues2"] = {};
        $examples.singlevalues2.json = `{
  "name": "John",
  "age": 30,
  "address":
  {
    "city": "Dallas",
    "pincode": 75201
  }
}
  `;
        $examples.singlevalues2.rjql = ` address>city = "Dallas"`;
    }


    function setConjuctionExample($examples) {
        $examples.and = {
            json: conj_json,
            rjql: `data>dataFields[]:
    name = "MsnAcquisitionDate"
    series[]:
        value = "2019-08-18T23:59:56"
&&        
data>dataFields[]:
    name = "MsnAcquisition"
    series[]:
        value = "Less fuel!!!"
        `
        };

        $examples.or = {
            json: conj_json,
            rjql: `data>dataFields[]:
    name = "MsnAcquisitionDate"
    series[]:
        value = "2019-08-18T23:59:56"
||        
data>dataFields[]:
    name = "MapVersion64Byte_Upper16Byte"
    series[]:
        type = "LKCD"
        `
        };

    }

    /* src\App.svelte generated by Svelte v3.18.1 */
    const file$b = "src\\App.svelte";

    // (187:6) {:else}
    function create_else_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Page Not Found";
    			add_location(h1, file$b, 187, 8, 4474);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(187:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (185:29) 
    function create_if_block_8(ctx) {
    	let current;
    	const usage = new Usage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(usage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usage, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(185:29) ",
    		ctx
    	});

    	return block;
    }

    // (183:29) 
    function create_if_block_7(ctx) {
    	let current;
    	const repl = new Repl({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(repl.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(repl, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(repl.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(repl.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(repl, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(183:29) ",
    		ctx
    	});

    	return block;
    }

    // (181:28) 
    function create_if_block_6(ctx) {
    	let current;
    	const conjunction = new Conjunction({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(conjunction.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(conjunction, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(conjunction.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(conjunction.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(conjunction, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(181:28) ",
    		ctx
    	});

    	return block;
    }

    // (179:28) 
    function create_if_block_5(ctx) {
    	let current;
    	const aggregationfunction = new AggregationFunction({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(aggregationfunction.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(aggregationfunction, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aggregationfunction.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aggregationfunction.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(aggregationfunction, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(179:28) ",
    		ctx
    	});

    	return block;
    }

    // (177:28) 
    function create_if_block_4(ctx) {
    	let current;
    	const queryvariables = new QueryVariables({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(queryvariables.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(queryvariables, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(queryvariables.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(queryvariables.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(queryvariables, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(177:28) ",
    		ctx
    	});

    	return block;
    }

    // (175:28) 
    function create_if_block_3(ctx) {
    	let current;
    	const arrays = new Arrays({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(arrays.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(arrays, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrays.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrays.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(arrays, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(175:28) ",
    		ctx
    	});

    	return block;
    }

    // (173:28) 
    function create_if_block_2$1(ctx) {
    	let current;
    	const singlevalues = new SingleValues({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(singlevalues.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(singlevalues, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(singlevalues.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(singlevalues.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(singlevalues, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(173:28) ",
    		ctx
    	});

    	return block;
    }

    // (171:28) 
    function create_if_block_1$1(ctx) {
    	let current;
    	const operators = new Operators({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(operators.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(operators, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(operators.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(operators.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(operators, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(171:28) ",
    		ctx
    	});

    	return block;
    }

    // (169:6) {#if $menu === 0}
    function create_if_block$2(ctx) {
    	let current;
    	const home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(169:6) {#if $menu === 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let div6;
    	let div4;
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;
    	let t2;
    	let div0;
    	let t4;
    	let div3;
    	let t6;
    	let ul;
    	let li0;
    	let a0;
    	let li0_class_value;
    	let t8;
    	let li1;
    	let a1;
    	let li1_class_value;
    	let t10;
    	let li2;
    	let a2;
    	let li2_class_value;
    	let t12;
    	let li3;
    	let a3;
    	let li3_class_value;
    	let t14;
    	let li4;
    	let a4;
    	let li4_class_value;
    	let t16;
    	let li5;
    	let a5;
    	let li5_class_value;
    	let t18;
    	let li6;
    	let a6;
    	let li6_class_value;
    	let t20;
    	let li7;
    	let a7;
    	let li7_class_value;
    	let t22;
    	let li8;
    	let a8;
    	let li8_class_value;
    	let t24;
    	let div5;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let dispose;

    	const if_block_creators = [
    		create_if_block$2,
    		create_if_block_1$1,
    		create_if_block_2$1,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8,
    		create_else_block
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$menu*/ ctx[0] === 0) return 0;
    		if (/*$menu*/ ctx[0] === 1) return 1;
    		if (/*$menu*/ ctx[0] === 2) return 2;
    		if (/*$menu*/ ctx[0] === 3) return 3;
    		if (/*$menu*/ ctx[0] === 4) return 4;
    		if (/*$menu*/ ctx[0] === 5) return 5;
    		if (/*$menu*/ ctx[0] === 6) return 6;
    		if (/*$menu*/ ctx[0] === 10) return 7;
    		if (/*$menu*/ ctx[0] === 11) return 8;
    		return 9;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div6 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			span.textContent = "RJQL";
    			t2 = space();
    			div0 = element("div");
    			div0.textContent = "Sahir";
    			t4 = space();
    			div3 = element("div");
    			div3.textContent = "✨Rahul's JSON Query Language";
    			t6 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t8 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Operators";
    			t10 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Single Values";
    			t12 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Arrays";
    			t14 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Query Variables";
    			t16 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Aggregation";
    			t18 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "Conjunction";
    			t20 = space();
    			li7 = element("li");
    			a7 = element("a");
    			a7.textContent = "Usage";
    			t22 = space();
    			li8 = element("li");
    			a8 = element("a");
    			a8.textContent = "REPL";
    			t24 = space();
    			div5 = element("div");
    			if_block.c();
    			if (img.src !== (img_src_value = "rjql-logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "svelte-1yh2frb");
    			add_location(img, file$b, 125, 10, 2353);
    			attr_dev(span, "class", "svelte-1yh2frb");
    			add_location(span, file$b, 126, 10, 2403);
    			attr_dev(div0, "class", "version svelte-1yh2frb");
    			add_location(div0, file$b, 127, 10, 2432);
    			attr_dev(div1, "class", "title svelte-1yh2frb");
    			add_location(div1, file$b, 124, 8, 2322);
    			attr_dev(div2, "class", "header svelte-1yh2frb");
    			add_location(div2, file$b, 123, 6, 2292);
    			attr_dev(div3, "class", "rjql-desc svelte-1yh2frb");
    			add_location(div3, file$b, 130, 6, 2502);
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$b, 133, 10, 2639);
    			attr_dev(li0, "class", li0_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 0 ? "sel" : "") + " svelte-1yh2frb"));
    			add_location(li0, file$b, 132, 8, 2591);
    			attr_dev(a1, "href", "/");
    			add_location(a1, file$b, 136, 10, 2776);
    			attr_dev(li1, "class", li1_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 1 ? "sel" : "") + " svelte-1yh2frb"));
    			add_location(li1, file$b, 135, 8, 2728);
    			attr_dev(a2, "href", "/");
    			add_location(a2, file$b, 139, 10, 2918);
    			attr_dev(li2, "class", li2_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 2 ? "sel" : "") + " svelte-1yh2frb"));
    			add_location(li2, file$b, 138, 8, 2870);
    			attr_dev(a3, "href", "/");
    			add_location(a3, file$b, 144, 10, 3090);
    			attr_dev(li3, "class", li3_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 3 ? "sel" : "") + " svelte-1yh2frb"));
    			add_location(li3, file$b, 143, 8, 3042);
    			attr_dev(a4, "href", "/");
    			add_location(a4, file$b, 147, 10, 3229);
    			attr_dev(li4, "class", li4_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 4 ? "sel" : "") + " svelte-1yh2frb"));
    			add_location(li4, file$b, 146, 8, 3181);
    			attr_dev(a5, "href", "/");
    			add_location(a5, file$b, 152, 10, 3403);
    			attr_dev(li5, "class", li5_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 5 ? "sel" : "") + " svelte-1yh2frb"));
    			add_location(li5, file$b, 151, 8, 3355);
    			attr_dev(a6, "href", "/");
    			add_location(a6, file$b, 155, 10, 3546);
    			attr_dev(li6, "class", li6_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 6 ? "sel" : "") + " svelte-1yh2frb"));
    			add_location(li6, file$b, 154, 8, 3498);
    			attr_dev(a7, "href", "/");
    			add_location(a7, file$b, 158, 10, 3689);
    			attr_dev(li7, "class", li7_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 11 ? "sel" : "") + " svelte-1yh2frb"));
    			add_location(li7, file$b, 157, 8, 3640);
    			attr_dev(a8, "href", "/");
    			add_location(a8, file$b, 161, 10, 3827);
    			attr_dev(li8, "class", li8_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 10 ? "sel" : "") + " svelte-1yh2frb"));
    			add_location(li8, file$b, 160, 8, 3778);
    			attr_dev(ul, "id", "menu");
    			attr_dev(ul, "class", "svelte-1yh2frb");
    			add_location(ul, file$b, 131, 6, 2567);
    			attr_dev(div4, "class", "left-part svelte-1yh2frb");
    			add_location(div4, file$b, 122, 4, 2261);
    			attr_dev(div5, "class", "right-part svelte-1yh2frb");
    			add_location(div5, file$b, 166, 4, 3946);
    			attr_dev(div6, "class", "content svelte-1yh2frb");
    			add_location(div6, file$b, 121, 2, 2234);
    			attr_dev(main, "class", "svelte-1yh2frb");
    			add_location(main, file$b, 120, 0, 2224);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div6);
    			append_dev(div6, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, span);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div4, t6);
    			append_dev(div4, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t8);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t10);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t12);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t14);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t16);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			append_dev(ul, t18);
    			append_dev(ul, li6);
    			append_dev(li6, a6);
    			append_dev(ul, t20);
    			append_dev(ul, li7);
    			append_dev(li7, a7);
    			append_dev(ul, t22);
    			append_dev(ul, li8);
    			append_dev(li8, a8);
    			append_dev(div6, t24);
    			append_dev(div6, div5);
    			if_blocks[current_block_type_index].m(div5, null);
    			current = true;

    			dispose = [
    				listen_dev(a0, "click", prevent_default(/*click_handler*/ ctx[2]), false, true, false),
    				listen_dev(a1, "click", prevent_default(/*click_handler_1*/ ctx[3]), false, true, false),
    				listen_dev(a2, "click", prevent_default(/*click_handler_2*/ ctx[4]), false, true, false),
    				listen_dev(a3, "click", prevent_default(/*click_handler_3*/ ctx[5]), false, true, false),
    				listen_dev(a4, "click", prevent_default(/*click_handler_4*/ ctx[6]), false, true, false),
    				listen_dev(a5, "click", prevent_default(/*click_handler_5*/ ctx[7]), false, true, false),
    				listen_dev(a6, "click", prevent_default(/*click_handler_6*/ ctx[8]), false, true, false),
    				listen_dev(a7, "click", prevent_default(/*click_handler_7*/ ctx[9]), false, true, false),
    				listen_dev(a8, "click", prevent_default(/*click_handler_8*/ ctx[10]), false, true, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$menu*/ 1 && li0_class_value !== (li0_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 0 ? "sel" : "") + " svelte-1yh2frb"))) {
    				attr_dev(li0, "class", li0_class_value);
    			}

    			if (!current || dirty & /*$menu*/ 1 && li1_class_value !== (li1_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 1 ? "sel" : "") + " svelte-1yh2frb"))) {
    				attr_dev(li1, "class", li1_class_value);
    			}

    			if (!current || dirty & /*$menu*/ 1 && li2_class_value !== (li2_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 2 ? "sel" : "") + " svelte-1yh2frb"))) {
    				attr_dev(li2, "class", li2_class_value);
    			}

    			if (!current || dirty & /*$menu*/ 1 && li3_class_value !== (li3_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 3 ? "sel" : "") + " svelte-1yh2frb"))) {
    				attr_dev(li3, "class", li3_class_value);
    			}

    			if (!current || dirty & /*$menu*/ 1 && li4_class_value !== (li4_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 4 ? "sel" : "") + " svelte-1yh2frb"))) {
    				attr_dev(li4, "class", li4_class_value);
    			}

    			if (!current || dirty & /*$menu*/ 1 && li5_class_value !== (li5_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 5 ? "sel" : "") + " svelte-1yh2frb"))) {
    				attr_dev(li5, "class", li5_class_value);
    			}

    			if (!current || dirty & /*$menu*/ 1 && li6_class_value !== (li6_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 6 ? "sel" : "") + " svelte-1yh2frb"))) {
    				attr_dev(li6, "class", li6_class_value);
    			}

    			if (!current || dirty & /*$menu*/ 1 && li7_class_value !== (li7_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 11 ? "sel" : "") + " svelte-1yh2frb"))) {
    				attr_dev(li7, "class", li7_class_value);
    			}

    			if (!current || dirty & /*$menu*/ 1 && li8_class_value !== (li8_class_value = "" + (null_to_empty(/*$menu*/ ctx[0] == 10 ? "sel" : "") + " svelte-1yh2frb"))) {
    				attr_dev(li8, "class", li8_class_value);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div5, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $examples;
    	let $menu;
    	validate_store(examples, "examples");
    	component_subscribe($$self, examples, $$value => $$invalidate(1, $examples = $$value));
    	validate_store(menu, "menu");
    	component_subscribe($$self, menu, $$value => $$invalidate(0, $menu = $$value));

    	window.onscroll = function (e) {
    		
    	}; //console.log(e);

    	initExamples($examples);
    	const click_handler = () => set_store_value(menu, $menu = 0);
    	const click_handler_1 = () => set_store_value(menu, $menu = 1);
    	const click_handler_2 = () => set_store_value(menu, $menu = 2);
    	const click_handler_3 = () => set_store_value(menu, $menu = 3);
    	const click_handler_4 = () => set_store_value(menu, $menu = 4);
    	const click_handler_5 = () => set_store_value(menu, $menu = 5);
    	const click_handler_6 = () => set_store_value(menu, $menu = 6);
    	const click_handler_7 = () => set_store_value(menu, $menu = 11);
    	const click_handler_8 = () => set_store_value(menu, $menu = 10);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("$examples" in $$props) examples.set($examples = $$props.$examples);
    		if ("$menu" in $$props) menu.set($menu = $$props.$menu);
    	};

    	return [
    		$menu,
    		$examples,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=rjql-doc.js.map
