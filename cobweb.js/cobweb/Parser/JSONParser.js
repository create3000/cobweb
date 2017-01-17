/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
 * Copyright John Carlson, USA 2016
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
	"cobweb/Basic/X3DArrayField",
	"cobweb/Fields",
	"cobweb/Parser/Parser",
	"cobweb/Parser/HTMLSupport",
	"cobweb/Prototype/X3DExternProtoDeclaration",
	"cobweb/Prototype/X3DProtoDeclaration",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DField,
          X3DArrayField,
          Fields,
          Parser,
	  HTMLSupport,   
          X3DExternProtoDeclaration,
          X3DProtoDeclaration,
          X3DConstants)
{
"use strict";

	var AccessType =
	{
		initializeOnly: X3DConstants .initializeOnly,
		inputOnly:      X3DConstants .inputOnly,
		outputOnly:     X3DConstants .outputOnly,
		inputOutput:    X3DConstants .inputOutput,
	};

	function JSONParser (scene)
	{
		this .scene             = scene;
		this .executionContexts = [ scene ];
		this .protoDeclarations = [ ];
		this .parents           = [ ];
		this .parser            = new Parser (this .scene, true);
		this .url               = new Fields .MFString ();
	}

	JSONParser .prototype =
	{
		constructor: JSONParser,
		getBrowser: function ()
		{
			return this .scene .getBrowser ();
		},
		getExecutionContext: function ()
		{
			return this .executionContexts [this .executionContexts .length - 1];
		},
		pushExecutionContext: function (executionContext)
		{
			return this .executionContexts .push (executionContext);
		},
		popExecutionContext: function ()
		{
			this .executionContexts .pop ();
		},
		getParent: function ()
		{
			return this .parents [this .parents .length - 1];
		},
		pushParent: function (parent)
		{
			return this .parents .push (parent);
		},
		popParent: function ()
		{
			this .parents .pop ();
		},
		parseIntoNode: function (node, json)
		{
			this .pushExecutionContext (node .getExecutionContext ());
			this .pushParent (node);

			this .statement (json);

			this .popParent ();
			this .popExecutionContext ();
		},
		parseIntoScene: function (json)
		{
			for (var key in json) {
				var child = json[key];
				switch (key) {
					case "X3D":
						this .X3D (child);
						break;
					case "Scene":
					case "SCENE":
						this .Scene (child);
						break;
					default:
						this .statement (child);
						break;
				}
			}
		},
		X3D: function (object)
		{
			this .profile (object);

			var specificationVersion = object["@version"];

			if (specificationVersion)
				this .scene .specificationVersion = specificationVersion;

			this .scene .encoding = "JSON";

			// Process child nodes

			for (var key in object)
			{
				var child = object [key];
			
				switch (key)
				{
					case "head":
					case "HEAD":
						this .head (child);
						continue;
					case "Scene":
					case "SCENE":
						this .Scene (child);
						continue;
				}
			}
		},
		profile: function (object)
		{
			try
			{
				var
					profileNameId = object["@profile"],
					profile       = this .getBrowser () .getProfile (profileNameId || "Full");

				this .scene .setProfile (profile);
			}
			catch (error)
			{
				console .log (error);
			}
		},
		head: function (object)
		{
			for (var key in object)
			{
				var array = object[key];
				switch (key)
				{
					case "component":
					case "COMPONENT":
						this .component (array);
						continue;
					case "unit":
					case "UNIT":
						this .unit (array);
						continue;
					case "meta":
					case "META":
						this .meta (array);
						continue;
				}
			}
		},
		component: function (array)
		{
			for (var i in array) {
				try
				{
					var
						componentNameIdCharacters = array[i]["@name"],
						componentSupportLevel = parseInt (array[i]["@level"]);
		
					if (componentNameIdCharacters == null)
						return console .warn ("JSON Parser Error: Bad component statement: Expected name attribute.");
		
					if (componentSupportLevel == null)
						return console .warn ("JSON Parser Error: Bad component statement: Expected level attribute.");

					var component = this .getBrowser () .getComponent (componentNameIdCharacters, componentSupportLevel);
		
					this .scene .addComponent (component);
				}
				catch (error)
				{
					console .log (error .message);
				}
			}
		},
		unit: function (array)
		{
			for (var i in array) {
				var
					category         = array[i]["@category"],
					name             = array[i]["@name"],
					conversionFactor = array[i]["@conversionFactor"]; //works for html5 as well

				if (category == null)
					return console .warn ("JSON Parser Error: Bad unit statement: Expected category attribute.");

				if (name == null)
					return console .warn ("JSON Parser Error: Bad unit statement: Expected name attribute.");

				if (conversionFactor == null)
					return console .warn ("JSON Parser Error: Bad unit statement: Expected conversionFactor attribute.");

				this .scene .updateUnit (category, name, parseFloat (conversionFactor));
			}
		},
		meta: function (array)
		{
			for (var i in array) {
				var
					metakey   = array[i]["@name"],
					metavalue = array[i]["@content"];

				if (metakey == null)
					return console .warn ("JSON Parser Error: Bad meta statement: Expected name attribute.");	

				if (metavalue === null)
					return console .warn ("JSON Parser Error: Bad meta statement: Expected content attribute.");

				this .scene .setMetaData (metakey, metavalue);
			}
		},
		Scene: function (object)
		{
			this .statements (object["-children"]);
		},
		statements: function (array)
		{
			for (var i in array) {
				this .statement (array[i]);
			}
		},
		statement: function (object)
		{
			for (var key in object) {
				var child = object[key];
				switch (key) {
					case "#comment":
					case "#text":
					case "#cdata-section":
						return;
					
					case "ExternProtoDeclare":
					case "EXTERNPROTODECLARE":
						this .ExternProtoDeclare (child);
						return;

					case "ProtoDeclare":
					case "PROTODECLARE":
						this .ProtoDeclare (child);
						return;

					case "ProtoInstance":
					case "PROTOINSTANCE":
						this .ProtoInstance (child);
						return;

					case "IMPORT":
						this .IMPORT (child);
						return;

					case "ROUTE":
						this .ROUTE (child);
						return;

					case "EXPORT":
						this .EXPORT (child);
						return;

					default:
						this .node (child, key);
						return;
				}
			}
		},
		node: function (object, key)
		{
			if (typeof object === 'string') {
				return;
			}
			try
			{
				if (this .USE (object))
					return;

				var node = this .getExecutionContext () .createNode (key, false);

				//AP: attach node to DOM element for access from DOM.
				object .x3d = node;

				this .DEF (object, node);
				this .addNode (object, node);
				this .pushParent (node);
				this .attributes (object, node);
				this .children (object["-children"], false);
				this .getExecutionContext () .addUninitializedNode (node);
				this .popParent ();
			}
			catch (error)
			{
				//console .error (error);

				console .error ("JSON Parser Error: " + error .message);
			}
		},
		ProtoInstance: function (object)
		{
			try
			{
				if (this .USE (object))
					return;

				var name = object["@name"];

				if (this .id (name))
				{
					var node = this .getExecutionContext () .createProto (name, false);

					//AP: attach node to DOM element for access from DOM.
					object .x3d = node;

					this .DEF (object, node);
					this .addNode (object, node);
					this .pushParent (node);
					this .children (object, true);
					this .getExecutionContext () .addUninitializedNode (node);
					this .popParent ();
				}
			}
			catch (error)
			{
				console .warn ("JSON Parser Error: ", error .message);
				//console .warn (error);
			}
		},
		children: function (children, protoInstance)
		{
			for (var i in children) {
				this .child (children[i], protoInstance);
			}
		},
		child: function (child, protoInstance)
		{
			for (var key in child) {
				switch (key) {
					case "#comment":
					case "#text":
						return;

					case "#sourceText":
						this .cdata (child);
						return;
					
					case "IS":
						this .IS (child);
						return;

					case "field":
					case "FIELD":
						this .field (child);
						return;

					case "fieldValue":
					case "FIELDVALUE":
						if (protoInstance)
							this .fieldValue (child);
						return;
							
					case "ExternProtoDeclare":
					case "EXTERNPROTODECLARE":
						this .ExternProtoDeclare (child);
						return;

					case "ProtoDeclare":
					case "PROTODECLARE":
						this .ProtoDeclare (child);
						return;

					case "ProtoInstance":
					case "PROTOINSTANCE":
						this .ProtoInstance (child);
						return;

					case "IMPORT":
						this .IMPORT (child);
						return;

					case "ROUTE":
						this .ROUTE (child);
						return;

					case "EXPORT":
						this .EXPORT (child);
						return;

					default:
						this .node (child, key);
						return;
				}
			}
		},
		DEF: function (object, node)
		{
			try
			{
				var name = object["@DEF"];

				if (name)
				{
					try
					{
						var namedNode = this .getExecutionContext () .getNamedNode (name);

						this .getExecutionContext () .updateNamedNode (this .getExecutionContext () .getUniqueName (name), namedNode);
					}
					catch (error)
					{ }

					this .getExecutionContext () .updateNamedNode (name, node);
				}
			}
			catch (error)
			{
				console .warn ("Invalid DEF name: " + error .message);
			}
		},
		USE: function (object)
		{
			try
			{
				var name = object["@USE"];

				if (this .id (name))
				{
					var node = this .getExecutionContext () .getNamedNode (name);

					this .addNode (object, node .getValue ());
					return true;
				}
			}
			catch (error)
			{
				console .warn ("Invalid USE name: " + error .message);
			}

			return false;
		},
		addNode: function (object, node)
		{
			if (this .parents .length)
			{
				var parent = this .getParent ();

				if (parent instanceof X3DField)
				{
					switch (parent .getType ())
					{
						case X3DConstants .SFNode:
							parent .setValue (node);
							parent .setSet (true);
							return;

						case X3DConstants .MFNode:
							parent .push (node);
							parent .setSet (true);
							return;
					}
				}
				else
				{
					// parent is a node.

					try
					{
						for (var key in object) {

							if (key.indexOf("-") === 0) {
								var containerField = object[key];
								var field = parent .getField (containerField);

								switch (field .getType ())
								{
									case X3DConstants .SFNode:
										field .setValue (node);
										field .setSet (true);
										return;

									case X3DConstants .MFNode:
										field .push (node);
										field .setSet (true);
										return;
								}
							}
						}
					}
					catch (error)
					{
						//console .warn (error .message);
					}

					try
					{
						// containerField attribute is not set or not found in node.

						var field = parent .getField (node .getContainerField ());

						switch (field .getType ())
						{
							case X3DConstants .SFNode:
								field .setValue (node);
								field .setSet (true);
								return;

							case X3DConstants .MFNode:
								field .push (node);
								field .setSet (true);
								return;
						}
					}
					catch (error)
					{
						//console .warn (error .message);
					}
				}
			}
			else
				this .getExecutionContext () .rootNodes .push (node);
		},
		attributes: function (object, node)
		{
			for (var key in object) {
				if (key.indexOf("@") === 0) {
					this .attribute (key.substr(1),  object[key], node);
				}
			}
		},
		attribute: function (name, value, node)
		{
			try
			{
				var
					field     = node .getField (this .attributeToCamelCase (name)),
					fieldType = this .fieldTypes [field .getType ()];

				this .parser .setInput (value);
				fieldType .call (this .parser, field);
				field .setSet (true);
			}
			catch (error)
			{
				//console .warn (error .message);
			}
		},
		cdata: function (array)
		{
			var
				node  = this .getParent (),
				field = node .getSourceText ();

			if (field)
			{
				field .push (array);
				field .setSet (true);
			}
		},
		fields: function (array) {
			for (var i in array) {
				this.field(array[i]);
			}
		},
		field: function (object)
		{
			var node = this .getParent ();

			if (! node .hasUserDefinedFields ())
				return;

			var accessType = AccessType [object["@accessType"]];

			if (accessType === undefined)
				accessType = X3DConstants .initializeOnly;

			var type = Fields [object["@type"]];

			if (type === undefined)
				return;

			var name = object["@name"];

			if (! this .id (name))
				return;

			var field = new type ();

			if (accessType & X3DConstants .initializeOnly)
			{
				var value = object["@value"];

				if (field instanceof X3DArrayField)
					field .length = 0;

				if (value !== null)
				{
					this .parser .setInput (value);
					this .fieldTypes [field .getType ()] .call (this .parser, field);
					field .setSet (true);
				}

				this .pushParent (field);
				this .statements (object["-children"]);
				this .popParent ();
			}

			node .addUserDefinedField (accessType, name, field);
		},
		fieldValue: function (array)
		{
			for (var f in array) {
				var object = array[f];
				try {
					var
						node = this .getParent (),
						name = object["@name"];

					if (! this .id (name))
						return;

					var
						field      = node .getField (name),
						accessType = field .getAccessType ();

					if (accessType & X3DConstants .initializeOnly)
					{
						var value = object["@value"];

						if (field instanceof X3DArrayField)
							field .length = 0;

						if (value !== null)
						{
							this .parser .setInput (value);
							this .fieldTypes [field .getType ()] .call (this .parser, field);
							field .setSet (true);
						}

						this .pushParent (field);
						this .statements (object["-children"]);
						this .popParent ();
					}
				} catch (error) {
					console .warn ("JSON Parser Error: Couldn't assign field value: " + error .message);
				}
			}
		},
		IS: function (object)
		{
			if (this .getExecutionContext () instanceof X3DProtoDeclaration)
			{
				var children = object["connect"];

				for (var i in children) {
					var child = children [i];

					this .connect (child);
				}
			}
		},
		connect: function (object)
		{
			var
				nodeFieldName  = object ["@nodeField"],
				protoFieldName = object ["@protoField"];

			if (nodeFieldName === null)
				return console .warn ("JSON Parser Error: Bad connect statement: Expected nodeField attribute.");

			if (protoFieldName === null)
				return console .warn ("JSON Parser Error: Bad connect statement: Expected protoField attribute.");

			try
			{
				var
					node      = this .getParent (),
					proto     = this .getExecutionContext (),
					field     = node .getField (nodeFieldName),
					reference = proto .getField (protoFieldName);

				if (field .getType () === reference .getType ())
				{
					if (reference .isReference (field .getAccessType ()))
						field .addReference (reference);
					else
						throw new Error ("Field '" + field .getName () + "' and '" + reference .getName () + "' in PROTO " + this .getExecutionContext () . getName () + " are incompatible as an IS mapping.");
				}
				else
					throw new Error ("Field '" + field .getName () + "' and '" + reference .getName () + "' in PROTO " + this .getExecutionContext () .getName () + " have different types.");
			}
			catch (error)
			{
				console .warn ("JSON Parser Error: Couldn't create IS reference: " + error .message);
			}
		},
		ExternProtoDeclare: function (object)
		{
			var name = object ["@name"];

			if (this .id (name))
			{
				var url = object ["@url"];

				if (url === null)
					return console .warn ("JSON Parser Error: Bad ExternProtoDeclare statement: Expected url attribute.");
				
				if (url !== null)
				{
					this .parser .setInput (url);
					Parser .prototype .sfstringValues .call (this .parser, this .url);
				}
				else
					this .url .length = 0;

				var externproto = new X3DExternProtoDeclaration (this .getExecutionContext ());
							
				this .pushParent (externproto);
				this .ProtoInterface (object); // parse fields
				this .popParent ();

				externproto .setName (name);
				externproto .url_ = this .url;
				externproto .setup ();

				this .getExecutionContext () .externprotos .add (name, externproto);	
			}
		},
		ProtoDeclare: function (object)
		{
			var name = object["@name"];

			if (this .id (name))
			{
				var proto = new X3DProtoDeclaration (this .getExecutionContext ());
				for (var key in object) {
					var child = object [key];

					switch (key)
					{
						case "ProtoInterface":
							this .pushParent (proto);
							this .ProtoInterface (child);
							this .popParent ();
							continue;
						case "ProtoBody":
							this .pushExecutionContext (proto);
							this .ProtoBody (child);
							this .popExecutionContext ();
							continue;
					}
				}

				proto .setName (name);
				proto .setup ();

				this .getExecutionContext () .protos .add (name, proto);
			}
		},
		ProtoInterface: function (object)
		{
			for (var key in object) {
				var child = object [key];

				switch (key)
				{
					case "FIELD": // User-defined field
					case "field": // User-defined field
						this .field (child);
						continue;
				}
			}
		},
		ProtoBody: function (object)
		{
			this .statements (object["-children"]);
		},
		IMPORT: function (object)
		{
			try
			{
				var
					inlineNodeName   = object["@inlineDEF"],
					exportedNodeName = object["@exportedDEF"],
					localNodeName    = object ["@AS"];

				if (inlineNodeName === null)
					throw new Error ("Bad IMPORT statement: Expected exportedDEF attribute.");

				if (exportedNodeName === null)
					throw new Error ("Bad IMPORT statement: Expected exportedDEF attribute.");

				if (! localNodeName)
					localNodeName = exportedNodeName;

				var namedNode = this .getExecutionContext () .getNamedNode (inlineNodeName);

				this .getExecutionContext () .updateImportedNode (namedNode, exportedNodeName, localNodeName);
			}
			catch (error)
			{
				console .warn ("JSON Parser Error: " + error .message);
			}
		},
		ROUTE: function (object)
		{
			try
			{
				var
					sourceNodeName      = object["@fromNode"],
					sourceField         = object["@fromField"],
					destinationNodeName = object["@toNode"],
					destinationField    = object["@toField"];

				if (sourceNodeName === null)
					throw new Error ("Bad ROUTE statement: Expected fromNode attribute.");

				if (sourceField === null)
					throw new Error ("Bad ROUTE statement: Expected fromField attribute.");

				if (destinationNodeName === null)
					throw new Error ("Bad ROUTE statement: Expected toNode attribute.");

				if (destinationField === null)
					throw new Error ("Bad ROUTE statement: Expected toField attribute.");

				var
					executionContext = this .getExecutionContext (),
					sourceNode       = executionContext .getLocalNode (sourceNodeName),
					destinationNode  = executionContext .getLocalNode (destinationNodeName),
					route            = executionContext .addRoute (sourceNode, sourceField, destinationNode, destinationField);

				object .x3d = route;
			}
			catch (error)
			{
				console .warn ("JSON Parser Error: " + error .message);
			}
		},
		EXPORT: function (object)
		{
			try
			{
				var
					localNodeName    = object["@localDEF"],
					exportedNodeName = object["@AS"];

				if (localNodeName === null)
					throw new Error ("Bad EXPORT statement: Expected localDEF attribute.");

				if (! exportedNodeName)
					exportedNodeName = localNodeName;

				var localNode = this .getExecutionContext () .getLocalNode (localNodeName);

				this .getExecutionContext () .updateExportedNode (exportedNodeName, localNode);
			}
			catch (error)
			{
				console .warn ("JSON Parser Error: " + error .message);
			}
		},
		id: function (string)
		{
			if (string === null)
				return false;

			if (string .length === 0)
				return false;

			return true;
		},
		attributeToCamelCase: function (name)
		{
			if (name !== name .toLowerCase())
				return name ;
			
			return HTMLSupport .attributeLowerCaseToCamelCase [name] ;
		},
	};

	JSONParser .prototype .fieldTypes = [ ];
	JSONParser .prototype .fieldTypes [X3DConstants .SFBool]      = Parser .prototype .sfboolValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFColor]     = Parser .prototype .sfcolorValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFColorRGBA] = Parser .prototype .sfcolorrgbaValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFDouble]    = Parser .prototype .sfdoubleValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFFloat]     = Parser .prototype .sffloatValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFImage]     = Parser .prototype .sfimageValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFInt32]     = Parser .prototype .sfint32Value;
	JSONParser .prototype .fieldTypes [X3DConstants .SFMatrix3f]  = Parser .prototype .sfmatrix3dValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFMatrix3d]  = Parser .prototype .sfmatrix3fValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFMatrix4f]  = Parser .prototype .sfmatrix4dValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFMatrix4d]  = Parser .prototype .sfmatrix4fValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFNode]      = function (field) { field .set (null); };
	JSONParser .prototype .fieldTypes [X3DConstants .SFRotation]  = Parser .prototype .sfrotationValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFString]    = function (field) { field .set (this .input); };
	JSONParser .prototype .fieldTypes [X3DConstants .SFTime]      = Parser .prototype .sftimeValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFVec2d]     = Parser .prototype .sfvec2dValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFVec2f]     = Parser .prototype .sfvec2fValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFVec3d]     = Parser .prototype .sfvec3dValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFVec3f]     = Parser .prototype .sfvec3fValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFVec4d]     = Parser .prototype .sfvec4dValue;
	JSONParser .prototype .fieldTypes [X3DConstants .SFVec4f]     = Parser .prototype .sfvec4fValue;

	JSONParser .prototype .fieldTypes [X3DConstants .MFBool]      = Parser .prototype .sfboolValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFColor]     = Parser .prototype .sfcolorValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFColorRGBA] = Parser .prototype .sfcolorrgbaValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFDouble]    = Parser .prototype .sfdoubleValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFFloat]     = Parser .prototype .sffloatValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFImage]     = Parser .prototype .sfimageValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFInt32]     = Parser .prototype .sfint32Values;
	JSONParser .prototype .fieldTypes [X3DConstants .MFMatrix3d]  = Parser .prototype .sfmatrix3dValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFMatrix3f]  = Parser .prototype .sfmatrix3fValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFMatrix4d]  = Parser .prototype .sfmatrix4dValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFMatrix4f]  = Parser .prototype .sfmatrix4fValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFNode]      = function () { };
	JSONParser .prototype .fieldTypes [X3DConstants .MFRotation]  = Parser .prototype .sfrotationValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFString]    = Parser .prototype .sfstringValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFTime]      = Parser .prototype .sftimeValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFVec2d]     = Parser .prototype .sfvec2dValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFVec2f]     = Parser .prototype .sfvec2fValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFVec3d]     = Parser .prototype .sfvec3dValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFVec3f]     = Parser .prototype .sfvec3fValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFVec4d]     = Parser .prototype .sfvec4dValues;
	JSONParser .prototype .fieldTypes [X3DConstants .MFVec4f]     = Parser .prototype .sfvec4fValues;

	return JSONParser;
});
