/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the Cobweb Project.
 *
 * Cobweb is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * Cobweb is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with Cobweb.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
	"cobweb/InputOutput/Generator",
],
function ($, X3DField, X3DConstants, Generator)
{
"use strict";

	var handler =
	{
		get: function (target, key)
		{
			try
			{
				if (key in target)
					return target [key];

				// value
				
				var
					array = target .getValue (),
					index = parseInt (key);

				if (index >= array .length)
					target .resize (index + 1);

				return array [index] .valueOf ();
			}
			catch (error)
			{
				// Don't know what to do with symbols, but it seem not to affect anything.
				if ((typeof key) === "symbol")
					return;

				// if target not instance of X3DArrayField, then the constuctor is called as function.
				console .log (target, typeof key, key, error);
			}
		},
		set: function (target, key, value)
		{
			try
			{
				if (key in target)
				{
					target [key] = value;
					return true;
				}

				var
					array = target .getValue (),
					index = parseInt (key);

				if (index >= array .length)
					target .resize (index + 1);

				array [index] .setValue (value);
				return true;
			}
			catch (error)
			{
				// if target not instance of X3DArrayField, then the constuctor is called as function.
				console .log (target, key, error);
				return false;
			}
		},
		has: function (target, key)
		{
			return key in target .getValue ();
		},
		enumerate: function (target)
		{
			return Object .keys (target .getValue ()) [Symbol.iterator] ();
		},
	};

	function X3DArrayField (value)
	{
		X3DField .call (this, [ ]);
		
		if (value [0] instanceof Array)
			value = value [0];

		for (var i = 0, length = value .length; i < length; ++ i)
			this .push (value [i]);

		return new Proxy (this, handler);
	}

	X3DArrayField .prototype = $.extend (new X3DField ([ ]),
	{
		constructor: X3DArrayField,
		copy: function ()
		{
			var
				copy  = new (this .constructor) (),
				array = this .getValue ();

			for (var i = 0, length = array .length; i < length; ++ i)
				copy .push (array [i]);

			return copy;
		},
		setValue: function (value)
		{
			this .set (value instanceof X3DArrayField ? value .getValue () : value);
			this .addEvent ();
		},
		set: function (value)
		{
			this .resize (value .length, undefined, true);

			var array = this .getValue ();

			for (var i = 0, length = value .length; i < length; ++ i)
				array [i] .set (value [i] instanceof X3DField ? value [i] .getValue () : value [i]);
		},
		unshift: function (value)
		{
			var
				array = this .getValue (),
				field = new (this .ValueType) ();

			field .setValue (value);
			field .addParent (this);

			this .addEvent ();

			return array .unshift (field);
		},
		shift: function ()
		{
			var array = this .getValue ();

			if (array .length)
			{
				var field = array .shift ();
				field .removeParent (this);
				this .addEvent ();
				return field .valueOf ();
			}
		},
		push: function (value)
		{
			var
				array = this .getValue (),
				field = new (this .ValueType) ();

			field .setValue (value);
			field .addParent (this);

			this .addEvent ();

			return array .push (field);
		},
		pop: function ()
		{
			var array = this .getValue ();

			if (array .length)
			{
				var field = array .pop ();
				field .removeParent (this);
				this .addEvent ();
				return field .valueOf ();
			}
		},
		insert: function (index, array, first, last)
		{
			var args = [index, 0];

			for (var i = first; i < last; ++ i)
			{
				var field = new (this .ValueType) ();

				field .setValue (array [i]);
				field .addParent (this);

				args .push (field);
			}

			Array .prototype .splice .apply (this .getValue (), args);

			this .addEvent ();
		},
		erase: function (first, last)
		{
			var values = this .getValue () .splice (first, last - first);
				
			for (var i = 0, length = values .length; i < length; ++ i)
				values [i] .removeParent (this);
			
			this .addEvent ();
		},
		resize: function (size, value, silent)
		{
			var array = this .getValue ();
		
			if (size < array .length)
			{
				for (var i = size, length = array .length; i < length; ++ i)
					array [i] .removeParent (this);

				array .length = size;

				if (! silent)
					this .addEvent ();
			}
			else if (size > array .length)
			{
				for (var i = array .length; i < size; ++ i)
				{
					var field = new (this .ValueType) ();

					if (value !== undefined)
						field .setValue (value);

					field .addParent (this);
					array .push (field);
				}

				if (! silent)
					this .addEvent ();
			}
		},
		toString: function ()
		{
			var
				array  = this .getValue (),
				string = "";

			switch (array .length)
			{
				case 0:
				{
					string += "[ ]";
					break;
				}
				case 1:
				{
					string += array [0] .toString ();
					break;
				}
				default:
				{
					string += "[\n";
					Generator .IncIndent ();
				
					for (var i = 0, length = array .length - 1; i < length; ++ i)
					{
						string += Generator .Indent ();
						string += array [i] .toString ();
						string += ",\n"
					}

					string += Generator .Indent ();
					string += array [length] .toString ();
					string += "\n";
					Generator .DecIndent ();
					string += Generator .Indent ();
					string += "]";
					break;
				}
			}

			return string;
		},
	});

	Object .defineProperty (X3DArrayField .prototype, "length",
	{
		get: function () { return this .getValue () .length; },
		set: function (value) { this .resize (value); },
		enumerable: false,
		configurable: false
	});

	return X3DArrayField;
});
